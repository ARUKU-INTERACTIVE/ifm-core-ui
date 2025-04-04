import { useState } from 'react';

import { usePlayers } from './hooks/usePlayers';

import PlayerList from '@/components/player/PlayerList';
import Loading from '@/components/ui/Loading';
import { IListResponse } from '@/interfaces/api/IApiBaseResponse';
import { IPlayer } from '@/interfaces/player/IPlayer';

export default function TransferMarket() {
	const [name, setName] = useState('');
	const { data: players, isLoading } = usePlayers(name, false);

	return (
		<>
			<h1
				className="text-xl font-bold text-center pt-3"
				data-test="transfer-market-title"
			>
				Transfer Market
			</h1>
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
			{isLoading ? (
				<Loading />
			) : (
				<PlayerList players={players as IListResponse<IPlayer>} />
			)}
		</>
	);
}
