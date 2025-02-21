import { useCookies } from 'react-cookie';
import { Navigate, Outlet } from 'react-router-dom';

import { StoredCookies } from '@/interfaces/auth/cookies.enum';

export default function AuthLayout() {
	const [cookies] = useCookies([
		StoredCookies.USERNAME,
		StoredCookies.REFRESH_TOKEN,
	]);

	const isAuthenticated =
		!!cookies[StoredCookies.REFRESH_TOKEN] && !!cookies[StoredCookies.USERNAME];

	if (isAuthenticated) {
		return <Navigate to="/" replace />;
	}

	return (
		<div>
			<Outlet />
		</div>
	);
}
