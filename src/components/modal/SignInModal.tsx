import React from 'react';

interface ISignInModalProps {
	isOpen: boolean;
	title: string;
	description: string;
	onClose: () => void;
	connectWallet?: () => Promise<void>;
	signInWithTransaction?: () => Promise<void>;
	isLoading?: boolean;
	isWalletConnected?: boolean;
}

const SignInModal: React.FC<ISignInModalProps> = ({
	isOpen,
	title,
	description,
	onClose,
	connectWallet,
	signInWithTransaction,
	isLoading,
	isWalletConnected,
}) => {
	if (!isOpen) return null;
	const isWalletConnectedText = isWalletConnected
		? 'Wallet connected'
		: 'Connect wallet';
	const isLoadingText =
		isLoading && !isWalletConnected ? 'Connecting...' : isWalletConnectedText;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div
				className="bg-white rounded-2xl p-6 w-96 max-w-md shadow-lg"
				data-test="sign-in-modal"
			>
				<div className="flex justify-between items-center">
					<h2 className="text-2xl font-bold mb-4">{title}</h2>
					<button
						className="text-md font-bold mb-4 px-2 items-center rounded-full text-red-500"
						data-test="close-modal-button"
						onClick={onClose}
					>
						X
					</button>
				</div>
				<p className="text-gray-600 mb-6">{description}</p>
				<div className="flex flex-col gap-2 items-center">
					{connectWallet && (
						<button
							onClick={connectWallet}
							className={`px-4 py-2 w-52 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition ${
								isWalletConnected ? 'opacity-50' : 'opacity-100'
							}`}
							disabled={isWalletConnected || isLoading}
							data-test="connect-wallet-button"
						>
							{isLoadingText}
						</button>
					)}
					{signInWithTransaction && (
						<button
							onClick={signInWithTransaction}
							className={`px-4 py-2 w-52 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition ${
								isWalletConnected && !isLoading ? 'opacity-100' : 'opacity-50'
							}`}
							disabled={!isWalletConnected || isLoading}
							data-test="sign-in-with-transaction-button"
						>
							{isLoading && isWalletConnected
								? 'Verifying...'
								: 'Verify wallet to sign in'}
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default SignInModal;
