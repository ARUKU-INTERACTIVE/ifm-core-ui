import { Keypair } from '@stellar/stellar-sdk';
import { useCallback, useState } from 'react';
import { connectWallet, signTransaction } from 'simple-stellar-signer-api';

import { SIMPLE_SIGNER_URL } from '@/configs/environment';

export const useSimpleSigner = () => {
	const [publicKey, setPublicKey] = useState<string>('');

	const handleConnectWallet = async () => {
		try {
			const { publicKey } = await connectWallet(SIMPLE_SIGNER_URL);

			if (Keypair.fromPublicKey(publicKey)) {
				setPublicKey(publicKey);
			}
		} catch (error) {
			const err = error as Error;
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
					return await signTransaction(xdr, SIMPLE_SIGNER_URL, {
						description,
					});
				} catch (error) {
					const err = error as Error;
					if (err.message.includes('User cancelled process')) {
						throw new Error('SIMPLE_SIGNER_SIGN_CANCELLED');
					}
					throw err;
				}
			}

			return signXDRTransaction(xdr, description);
		},
		[],
	);

	return {
		publicKey,
		handleConnectWallet,
		handleSignTransaction,
	};
};
