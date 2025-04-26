import { IFormationSpot } from '../interfaces/coordinates.interface';
import PlayerFormationCard from './PlayerFormationCard';

import { IPlayer } from '@/interfaces/player/IPlayer';

interface IFormationPlayersListProps {
	rosterPlayers: IPlayer[];
	handleUpdateFormationSpotInLayout: (
		formationSpot: IFormationSpot,
		player: IPlayer,
	) => void;
	selectedSpot: IFormationSpot | null;
}
const FormationPlayersList = ({
	rosterPlayers,
	handleUpdateFormationSpotInLayout,
	selectedSpot,
}: IFormationPlayersListProps) => {
	return (
		<section className="grid grid-cols-2 flex-wrap gap-2 h-64 overflow-scroll w-full">
			{rosterPlayers?.length ? (
				rosterPlayers.map((player) => (
					<div
						key={player.id}
						className="flex items-flex-start justify-between pt-3 group relative"
					>
						<button className="cursor-pointer"></button>
						<PlayerFormationCard
							player={player}
							handleClick={() => {
								if (selectedSpot) {
									handleUpdateFormationSpotInLayout(selectedSpot, player);
								}
							}}
						/>
					</div>
				))
			) : (
				<span className="font-semibold" data-test="team-players">
					No players
				</span>
			)}
		</section>
	);
};

export default FormationPlayersList;
