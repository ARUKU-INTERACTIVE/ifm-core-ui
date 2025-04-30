import { IFormationPlayerPartial } from '../interfaces/IFormationPlayers';

import {
	FormationMustHave11PlayersError,
	FormationMustHave11PlayersToUpdateError,
} from '@/errors/FormationMustHave11PlayersError';

export class FormationMapper {
	fromFormationPlayersPartialToFormationPlayersCreate(
		formationPlayers: IFormationPlayerPartial[],
		isCreating = true,
	) {
		return formationPlayers.map(({ position, positionIndex, player }) => {
			if (!player?.uuid || !positionIndex || !position) {
				if (isCreating) {
					throw new FormationMustHave11PlayersError();
				} else {
					throw new FormationMustHave11PlayersToUpdateError();
				}
			}
			return {
				position,
				positionIndex,
				playerUuid: player.uuid,
			};
		});
	}

	fromFormationPlayersPartialToUpdatedFormationPlayers(
		formationPlayers: IFormationPlayerPartial[],
	) {
		return formationPlayers.map(({ position, positionIndex, uuid }) => {
			if (!uuid || !positionIndex || !position) {
				throw new FormationMustHave11PlayersToUpdateError();
			}
			return {
				position,
				positionIndex,
				formationPlayerUuid: uuid,
			};
		});
	}
}

export const formationMapper = new FormationMapper();
