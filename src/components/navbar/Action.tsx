import { useEffect } from 'react';

import LoadingButton from '../ui/LoadingButton';
import Button from './Button';

interface IActionProps {
	connected: boolean;
	publicKey?: string;
	isLoading: boolean;
	handleSignInWithTransaction: (publicKey: string) => void;
	handleConnectWallet: () => void;
}

export default function Action({
	connected,
	publicKey,
	isLoading,
	handleConnectWallet,
	handleSignInWithTransaction,
}: IActionProps) {
	useEffect(() => {
		if (!publicKey || connected) {
			return;
		}

		handleSignInWithTransaction(publicKey);
	}, [publicKey, handleSignInWithTransaction, connected]);

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
			onClick={() => handleConnectWallet()}
			data-test="sign-in-btn"
		>
			Sign In
		</button>
	);
}
