import SignInForm from '@/components/auth/SignInForm';
import { useAuthProvider } from '@/hooks/auth/useAuthProvider';

export default function SignIn() {
	const { loadingState } = useAuthProvider();
	const handleSubmit = async (username: string, password: string) => {
		console.log({ username, password });
	};
	return (
		<div className="flex-1">
			<SignInForm handleSubmit={handleSubmit} loading={loadingState.signIn} />
		</div>
	);
}
