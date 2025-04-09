import { useState } from 'react';

import { usePlayers } from './hooks/usePlayers';

import MintPlayerModal from '@/components/player/MintPlayerModal';
import PlayerList from '@/components/player/PlayerList';
import Loading from '@/components/ui/Loading';
import { IListResponse } from '@/interfaces/api/IApiBaseResponse';
import { IPlayer } from '@/interfaces/player/IPlayer';

export default function TransferMarket() {
	const [name, setName] = useState('');
	const { data: players, isLoading } = usePlayers(name, false);
	const [isMintPlayerModalOpen, setIsMintPlayerModalOpen] = useState(false);

	const handleOpenMintPlayerModal = () => {
		setIsMintPlayerModalOpen(true);
	};

	const handleCloseMintPlayerModal = () => {
		setIsMintPlayerModalOpen(false);
	};

	return (
		<>
			<div className="flex justify-center items-center pt-3">
				<h1
					className="text-xl font-bold text-center"
					data-test="transfer-market-title"
				>
					Transfer Market
				</h1>
				<button
					className="absolute right-3 bg-green-200 py-1 px-2 rounded-md"
					onClick={handleOpenMintPlayerModal}
					data-test="transfer-market-mint-player-button"
				>
					Mint Player
				</button>
			</div>
			<div className="flex justify-center items-center">
				<input
					type="text"
					placeholder="Search..."
					value={name}
					className="w-[90%] p-2 m-3 border border-gray-300 rounded-md"
					onChange={(e) => setName(e.target.value)}
					data-test="transfer-market-searchbar"
				/>
			</div>

			<MintPlayerModal
				isOpen={isMintPlayerModalOpen}
				onHide={handleCloseMintPlayerModal}
			/>
			{isLoading ? (
				<Loading />
			) : (
				<PlayerList players={players as IListResponse<IPlayer>} />
			)}
		</>
	);
}
