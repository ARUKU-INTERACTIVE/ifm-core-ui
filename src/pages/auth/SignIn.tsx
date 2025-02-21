import SignInForm from '@/components/auth/SignInForm';
import { useAuthProvider } from '@/hooks/auth/useAuthProvider';

export default function SignIn() {
	const { handleSignIn, loadingState } = useAuthProvider();
	return (
		<div className="flex-1">
			<SignInForm handleSubmit={handleSignIn} loading={loadingState.signIn} />
		</div>
	);
}
