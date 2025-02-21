import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import { useAuthProvider } from '@/hooks/auth/useAuthProvider';

export default function ForgotPassword() {
	const { handleForgotPassword, loadingState } = useAuthProvider();
	return (
		<div className="flex-1">
			<ForgotPasswordForm
				handleSubmit={handleForgotPassword}
				loading={loadingState.forgotPassword}
			/>
		</div>
	);
}
