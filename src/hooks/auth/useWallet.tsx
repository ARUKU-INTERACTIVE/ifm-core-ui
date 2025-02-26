import { useState } from 'react';

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
	const { handleConnectWallet, handleSignTransaction, publicKey } =
		useSimpleSigner();
	const { handleSignIn } = useAuthProvider();

	const connectWallet = async () => {
		try {
			await handleConnectWallet();
			notificationService.success(CONNECT_WALLET_MESSAGE);
		} catch (error) {
			return notificationService.error(CONNECT_WALLET_ERROR);
		}
	};

	const signTransaction = async (transactionXDR: string) => {
		try {
			const signedTransaction = await handleSignTransaction(transactionXDR);

			notificationService.success(TRANSACTION_SIGNED_MESSAGE);
			return signedTransaction;
		} catch (error) {
			return notificationService.error(SIGN_TRANSACTION_ERROR);
		}
	};

	const signInWithTransaction = async (publicKey: string) => {
		setIsLoading(true);
		const { transactionXDR, nonce } = await authService.getChallengeTransaction(
			publicKey,
		);

		if (!transactionXDR || !nonce) {
			notificationService.error(INVALID_TRANSACTION_ERROR);
		} else {
			const signedTransaction = await signTransaction(transactionXDR);

			if (!signedTransaction) {
				setIsLoading(false);
				return;
			}

			handleSignIn(signedTransaction, publicKey, nonce);
		}

		setIsLoading(false);
	};

	return {
		isLoading,
		publicKey,
		connectWallet,
		signInWithTransaction,
	};
}
