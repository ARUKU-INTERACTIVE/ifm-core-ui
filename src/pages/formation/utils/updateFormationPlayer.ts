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

export const removeFormationPlayer = (
	formationPlayers: IFormationPlayerPartial[],
	formationPlayer: IFormationPlayerPartial,
	player: IPlayer | null,
) => {
	return formationPlayers.map((currentFormationPlayer) =>
		currentFormationPlayer.positionIndex === formationPlayer.positionIndex
			? {
					position: currentFormationPlayer.position,
					positionIndex: currentFormationPlayer.positionIndex,
					player,
			  }
			: currentFormationPlayer,
	);
};
