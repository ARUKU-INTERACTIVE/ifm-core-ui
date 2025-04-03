import Card from '../ui/Card';

import { IListResponse } from '@/interfaces/api/IApiBaseResponse';
import { IPlayer } from '@/interfaces/player/IPlayer';

const PlayerList = ({ players }: { players: IListResponse<IPlayer> }) => {
	return (
		<div className="grid grid-cols-3 gap-4 p-3">
			{players?.data.map((player) => (
				<Card key={player.id} name={player.attributes.name} />
			))}
		</div>
	);
};

export default PlayerList;
