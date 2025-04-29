import Button from './Button';

interface IActionProps {
	connected: boolean;
	isLoading: boolean;
	isWalletConnected: boolean;
	handleOpenSignInModal: () => void;
}

export default function Action({
	connected,
	isLoading,
	isWalletConnected,
	handleOpenSignInModal,
}: IActionProps) {
	if (connected) {
		return (
			<Button data-test="sign-out" to="/auth/sign-out" innerText="Sign Out" />
		);
	}

	return (
		<button
			className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full ${
				isLoading ? 'opacity-50' : 'opacity-100'
			}`}
			onClick={() => handleOpenSignInModal()}
			data-test="sign-in-btn"
		>
			{isWalletConnected ? 'Sign In' : 'Connect Wallet'}
		</button>
	);
}
