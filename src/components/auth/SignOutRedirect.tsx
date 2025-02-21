import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import { useAuthProvider } from '@/hooks/auth/useAuthProvider';

export default function SignOutRedirect() {
	const { handleSignOut } = useAuthProvider();
	useEffect(() => {
		handleSignOut();
	}, [handleSignOut]);
	return <Navigate to="/" />;
}
