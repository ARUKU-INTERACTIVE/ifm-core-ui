import ConfirmUserForm from '@/components/auth/ConfirmUserForm';
import { useAuthProvider } from '@/hooks/auth/useAuthProvider';

export default function ConfirmUser() {
	const { handleConfirmUser, loadingState } = useAuthProvider();
	return (
		<div className="flex-1">
			<ConfirmUserForm
				handleSubmit={handleConfirmUser}
				loading={loadingState.confirmUser}
			/>
		</div>
	);
}
