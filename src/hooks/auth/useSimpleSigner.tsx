import { Keypair } from '@stellar/stellar-sdk';
import { useCallback, useState } from 'react';
import { connectWallet, signTransaction } from 'simple-stellar-signer-api';

export const useSimpleSigner = () => {
	const [publicKey, setPublicKey] = useState<string>('');
	const network = import.meta.env.VITE_SIMPLE_SIGNER_URL;

	const handleConnectWallet = async () => {
		try {
			const { publicKey } = await connectWallet(network);

			if (Keypair.fromPublicKey(publicKey)) {
				setPublicKey(publicKey);
			}
		} catch (error) {
			const err = error as Error;
			console.error('[CONNECT_WALLET_ERROR]', err);
			if (err.message.includes('User cancelled process')) {
				throw new Error('SIMPLE_SIGNER_CONNECT_CANCELLED');
			}
			throw err;
		}
	};

	const handleSignTransaction = useCallback(
		(xdr: string, description?: string) => {
			async function signXDRTransaction(xdr: string, description?: string) {
				try {
					return await signTransaction(xdr, network, {
						description,
					});
				} catch (error) {
					const err = error as Error;
					console.error('[SIGN_TRANSACTION_ERROR]', err);
					if (err.message.includes('User cancelled process')) {
						throw new Error('SIMPLE_SIGNER_SIGN_CANCELLED');
					}
					throw err;
				}
			}

			return signXDRTransaction(xdr, description);
		},
		[network],
	);

	return {
		publicKey,
		handleConnectWallet,
		handleSignTransaction,
	};
};
