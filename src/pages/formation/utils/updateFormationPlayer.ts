import { IFormationPlayerPartial } from '../interfaces/formation-players.interface';

import { IPlayer } from '@/interfaces/player/IPlayer';

export const updateFormationPlayer = (
	formationPlayers: IFormationPlayerPartial[],
	formationPlayer: IFormationPlayerPartial,
	player: IPlayer | null,
) => {
	return formationPlayers.map((currentFormationPlayer) =>
		currentFormationPlayer.positionIndex === formationPlayer.positionIndex
			? { ...formationPlayer, player }
			: currentFormationPlayer,
	);
};
