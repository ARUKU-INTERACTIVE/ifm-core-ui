import { useCallback, useState } from 'react';

import { useAuthProvider } from './useAuthProvider';
import { useSimpleSigner } from './useSimpleSigner';

import {
	CONNECT_WALLET_ERROR,
	CONNECT_WALLET_MESSAGE,
	INVALID_TRANSACTION_ERROR,
	SIGN_TRANSACTION_ERROR,
	TRANSACTION_SIGNED_MESSAGE,
} from '@/context/auth-messages';
import { authService } from '@/services/auth.service';
import { notificationService } from '@/services/notification.service';

export function useWallet() {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { handleConnectWallet, handleSignTransaction } = useSimpleSigner();
	const { handleSignIn } = useAuthProvider();

	const connectWallet = async () => {
		try {
			await handleConnectWallet();
			notificationService.success(CONNECT_WALLET_MESSAGE);
		} catch {
			notificationService.error(CONNECT_WALLET_ERROR);
		}
	};

	const handleSignTransactionXDR = useCallback(
		(transactionXDR: string) => {
			async function signTransaction(transactionXDR: string) {
				try {
					const signedTransaction = await handleSignTransaction(transactionXDR);

					notificationService.success(TRANSACTION_SIGNED_MESSAGE);
					return signedTransaction;
				} catch {
					notificationService.error(SIGN_TRANSACTION_ERROR);
				}
			}

			return signTransaction(transactionXDR);
		},
		[handleSignTransaction],
	);

	const handleSignInWithTransaction = useCallback(
		(publicKey: string) => {
			async function signInWithTransaction(publicKey: string) {
				setIsLoading(true);
				const challengeTransactionResponse =
					await authService.getChallengeTransaction(publicKey);
				const { transactionXdr, memo } =
					challengeTransactionResponse.data.attributes;

				try {
					const signedTransaction = await handleSignTransactionXDR(
						transactionXdr,
					);

					if (!signedTransaction) {
						setIsLoading(false);
						return;
					}

					handleSignIn(signedTransaction, publicKey, memo);
				} catch {
					notificationService.error(INVALID_TRANSACTION_ERROR);
				}

				setIsLoading(false);
			}

			return signInWithTransaction(publicKey);
		},
		[handleSignIn, handleSignTransactionXDR],
	);

	return {
		isLoading,
		connectWallet,
		handleSignInWithTransaction,
		handleSignTransactionXDR,
	};
}
