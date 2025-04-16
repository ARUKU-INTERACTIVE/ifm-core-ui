import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';

import Action from './Action';
import Logo from './Logo';

import { StoredCookies } from '@/interfaces/auth/cookies.enum';

export default function NavBar() {
	const [cookies] = useCookies([StoredCookies.REFRESH_TOKEN]);
	const connected = !!cookies[StoredCookies.REFRESH_TOKEN];
	return (
		<div className="flex gap-4 p-2 shadow-md justify-between items-center">
			<Logo width={80} height={100} />
			<Link to="/transfer-market" className="text-sm font-bold">
				Transfer Market
			</Link>
			<Action connected={connected} />
		</div>
	);
}
