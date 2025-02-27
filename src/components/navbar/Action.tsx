import { useEffect } from 'react';

import Button from './Button';

import { useWallet } from '@/hooks/auth/useWallet';

type PropTypes = {
	readonly connected: boolean;
};

export default function Action({ connected }: PropTypes) {
	const { isLoading, connectWallet, signInWithTransaction, publicKey } =
		useWallet();

	useEffect(() => {
		if (!publicKey) return;

		signInWithTransaction(publicKey);
	}, [publicKey]);

	if (connected) {
		return (
			<Button data-test="sign-out" to="/auth/sign-out" innerText="Sign Out" />
		);
	}

	return isLoading ? (
		<button className="bg-blue-500 text-white font-bold rounded-full min-w-[100px]">
			<span className="material-symbols-outlined animate-spin pointer-events-none align-middle">
				progress_activity
			</span>
		</button>
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
