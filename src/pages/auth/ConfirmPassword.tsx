import ConfirmPasswordForm from '@/components/auth/ConfirmPasswordForm';
import { useAuthProvider } from '@/hooks/auth/useAuthProvider';

export default function ConfirmPassword() {
	const { loadingState, handleConfirmPassword } = useAuthProvider();
	return (
		<div className="flex-1">
			<ConfirmPasswordForm
				loading={loadingState.confirmPassword}
				handleSubmit={handleConfirmPassword}
			/>
		</div>
	);
}
