import { IFormationPlayerPartial } from '../interfaces/formation-players.interface';
import PlayerFormationCard from './PlayerFormationCard';

import { IPlayer } from '@/interfaces/player/IPlayer';

interface IFormationPlayersListProps {
	rosterPlayers: IPlayer[];
	selectedSpot: IFormationPlayerPartial | null;
	assignedPlayerUuids: (string | undefined)[];
	handleUpdateFormationSpotInLayout: (
		formationPlayer: IFormationPlayerPartial,
		player: IPlayer,
	) => void;
}
const FormationPlayersList = ({
	rosterPlayers,
	selectedSpot,
	assignedPlayerUuids,
	handleUpdateFormationSpotInLayout,
}: IFormationPlayersListProps) => {
	const unassignedRosterPlayers = rosterPlayers.filter(
		({ uuid }) => !assignedPlayerUuids.includes(uuid),
	);
	return (
		<section className="grid grid-cols-2 grid-rows-[50px] auto-rows-[50px] flex-wrap gap-2 h-64 overflow-scroll w-full">
			{unassignedRosterPlayers?.length ? (
				unassignedRosterPlayers.map((player) => (
					<div
						key={player.id}
						className="flex items-flex-start justify-between group relative w-full"
					>
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
				<span
					className="text-black col-span-2 inline-block text-center"
					data-test="team-players"
				>
					{rosterPlayers?.length
						? 'There are no more players in your roster to assign to the formation'
						: "You don't have any players added to your roster"}
				</span>
			)}
		</section>
	);
};

export default FormationPlayersList;
