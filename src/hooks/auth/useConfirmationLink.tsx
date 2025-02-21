import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { useAuthProvider } from './useAuthProvider';

export function useConfirmationLink() {
	const { search } = useLocation();
	const query = useMemo(() => new URLSearchParams(search), [search]);
	const auth = useAuthProvider();
	const username = query.get('username');
	const code = query.get('code');

	useEffect(() => {
		async function confirmUser() {
			if (!username || !code) return;
			await auth.handleConfirmUser(username, code);
		}
		confirmUser();
	}, [query, code, username, auth]);
}
