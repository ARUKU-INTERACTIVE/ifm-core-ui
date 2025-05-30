import { useCookies } from 'react-cookie';
import { Navigate, Outlet } from 'react-router-dom';

import { useAuthProvider } from '@/hooks/auth/useAuthProvider';
import { StoredCookies } from '@/interfaces/auth/cookies.enum';

export default function PrivateLayout() {
	const [cookies] = useCookies([
		StoredCookies.USERNAME,
		StoredCookies.REFRESH_TOKEN,
	]);
	const { handleRefreshSession, loadingState } = useAuthProvider();

	const isAuthenticated =
		!!cookies[StoredCookies.REFRESH_TOKEN] && !!cookies[StoredCookies.USERNAME];

	if (loadingState.refreshSession) {
		return (
			<div className="flex flex-1 items-center justify-center flex-col">
				<div className="flex flex-1 items-center justify-center">
					<span className="material-symbols-outlined animate-spin pointer-events-none">
						progress_activity
					</span>
				</div>
			</div>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to="/auth/sign-in" replace />;
	}

	return (
		<div>
			<Outlet />
		</div>
	);
}
