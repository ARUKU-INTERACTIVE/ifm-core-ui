import { IFormationPlayerPartial } from '../interfaces/IFormationPlayers';

import { IPlayer } from '@/interfaces/player/IPlayer';

export const updateFormationPlayer = (
	formationPlayers: IFormationPlayerPartial[],
	formationPlayer: IFormationPlayerPartial,
	player: IPlayer | null,
) => {
	return formationPlayers.map((currentFormationPlayer) =>
		currentFormationPlayer.positionIndex === formationPlayer.positionIndex
			? {
					...formationPlayer,
					uuid: player?.formationPlayerUuid ?? formationPlayer.uuid,
					player,
			  }
			: currentFormationPlayer,
	);
};
