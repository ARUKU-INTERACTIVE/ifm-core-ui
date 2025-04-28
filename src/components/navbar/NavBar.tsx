import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';

import Action from './Action';
import Logo from './Logo';

import { useWallet } from '@/hooks/auth/useWallet';
import { StoredCookies } from '@/interfaces/auth/cookies.enum';

export default function NavBar() {
	const [cookies] = useCookies([
		StoredCookies.REFRESH_TOKEN,
		StoredCookies.PUBLIC_KEY,
	]);
	const { isLoading, connectWallet, handleSignInWithTransaction } = useWallet();

	return (
		<div className="flex p-2 shadow-md justify-between items-center">
			<div className="flex gap-4 items-center">
				<Logo width={80} height={100} />
				<Link to="/transfer-market" className="text-sm font-bold">
					Transfer Market
				</Link>
				<Link to="/auctions" className="text-sm font-bold">
					Auctions
				</Link>
				<Link to="/team" className="text-sm font-bold">
					Team
				</Link>
				<Link to="/formation" className="text-sm font-bold">
					Formation
				</Link>
			</div>
			<Action
				connected={!!cookies[StoredCookies.REFRESH_TOKEN]}
				publicKey={cookies[StoredCookies.PUBLIC_KEY]}
				isLoading={isLoading}
				handleSignInWithTransaction={handleSignInWithTransaction}
				handleConnectWallet={connectWallet}
			/>
		</div>
	);
}
