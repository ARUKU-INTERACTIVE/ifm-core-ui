import { useCookies } from 'react-cookie';
import { Navigate, Outlet } from 'react-router-dom';

import { StoredCookies } from '@/interfaces/auth/cookies.enum';

export default function AuthLayout() {
	const [cookies] = useCookies([
		StoredCookies.PUBLIC_KEY,
		StoredCookies.REFRESH_TOKEN,
	]);

	const isAuthenticated =
		!!cookies[StoredCookies.REFRESH_TOKEN] &&
		!!cookies[StoredCookies.PUBLIC_KEY];

	if (isAuthenticated) {
		return <Navigate to="/" replace />;
	}

	return (
		<div>
			<Outlet />
		</div>
	);
}
