import SignUpForm from '@/components/auth/SignUpForm';
import { useAuthProvider } from '@/hooks/auth/useAuthProvider';

export default function SignUp() {
	const { handleSignUp, loadingState } = useAuthProvider();
	return (
		<div className="flex-1">
			<SignUpForm handleSubmit={handleSignUp} loading={loadingState.signUp} />
		</div>
	);
}
