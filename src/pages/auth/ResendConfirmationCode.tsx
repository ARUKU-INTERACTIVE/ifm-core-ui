import ResendConfirmationCodeForm from '@/components/auth/ResendConfirmationCodeForm';
import { useAuthProvider } from '@/hooks/auth/useAuthProvider';

export default function ResendConfirmationCode() {
	const { handleResendConfirmationCode, loadingState } = useAuthProvider();
	return (
		<div className="flex-1">
			<ResendConfirmationCodeForm
				handleSubmit={handleResendConfirmationCode}
				loading={loadingState.resendConfirmationCode}
			/>
		</div>
	);
}
