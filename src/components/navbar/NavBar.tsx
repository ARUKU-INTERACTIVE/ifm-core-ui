import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';

import SignInModal from '../modal/SignInModal';
import Action from './Action';
import Logo from './Logo';

import { useWallet } from '@/hooks/auth/useWallet';
import { StoredCookies } from '@/interfaces/auth/cookies.enum';

export default function NavBar() {
	const [cookies] = useCookies([
		StoredCookies.REFRESH_TOKEN,
		StoredCookies.PUBLIC_KEY,
	]);
	const description = cookies[StoredCookies.PUBLIC_KEY]
		? 'Verify your wallet to sign in'
		: 'Connect your wallet to continue';
	const { isLoading, connectWallet, handleSignInWithTransaction } = useWallet();
	const [isModalOpen, setIsModalOpen] = useState(false);

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
				isLoading={isLoading}
				isWalletConnected={!!cookies[StoredCookies.PUBLIC_KEY]}
				handleOpenSignInModal={() => setIsModalOpen(true)}
			/>
			<SignInModal
				isOpen={isModalOpen}
				title="Sign In"
				description={description}
				onClose={() => setIsModalOpen(false)}
				isLoading={isLoading}
				isWalletConnected={!!cookies[StoredCookies.PUBLIC_KEY]}
				connectWallet={connectWallet}
				signInWithTransaction={async () => {
					await handleSignInWithTransaction(cookies[StoredCookies.PUBLIC_KEY]);
					setIsModalOpen(false);
				}}
			/>
		</div>
	);
}
