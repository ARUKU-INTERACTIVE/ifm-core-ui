import { useEffect } from 'react';

import LoadingButton from '../ui/LoadingButton';
import Button from './Button';

import { useWallet } from '@/hooks/auth/useWallet';

type PropTypes = {
	readonly connected: boolean;
};

export default function Action({ connected }: PropTypes) {
	const { isLoading, connectWallet, handleSignInWithTransaction, publicKey } =
		useWallet();

	useEffect(() => {
		if (!publicKey) {
			return;
		}

		handleSignInWithTransaction(publicKey);
	}, [publicKey, handleSignInWithTransaction]);

	if (connected) {
		return (
			<Button data-test="sign-out" to="/auth/sign-out" innerText="Sign Out" />
		);
	}

	return isLoading ? (
		<LoadingButton />
	) : (
		<button
			className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
			onClick={() => connectWallet()}
			data-test="sign-in-btn"
		>
			Sign In
		</button>
	);
}
