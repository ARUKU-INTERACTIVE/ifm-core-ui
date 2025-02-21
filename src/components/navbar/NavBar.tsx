import { useCookies } from 'react-cookie';

import Action from './Action';
import Logo from './Logo';

import { StoredCookies } from '@/interfaces/auth/cookies.enum';

export default function NavBar() {
	const [cookies] = useCookies([
		StoredCookies.USERNAME,
		StoredCookies.REFRESH_TOKEN,
	]);
	const connected =
		!!cookies[StoredCookies.REFRESH_TOKEN] && !!cookies[StoredCookies.USERNAME];
	return (
		<div className="flex gap-4 p-2 shadow-md justify-between">
			<Logo width={100} height={50} />
			<Action connected={connected} />
		</div>
	);
}
