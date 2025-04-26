import {
	IFormationLayout,
	IFormationSavedLayout,
} from '../interfaces/formation-players.interface';

import { Position } from '@/interfaces/formation-player/IFormationPlayer.interface';
import { IFormation } from '@/interfaces/formation/IFormation.interface';

export const calculatePlayerSavedPositions = (
	formation: IFormation,
	formationSavedLayout: IFormationSavedLayout,
): IFormationLayout => {
	const formationDraftLayout: IFormationLayout = {
		defenders: [],
		midFielders: [],
		forwards: [],
		goalkeeper: [],
	};
	let positionIndex = 1;
	formationDraftLayout.goalkeeper.push({
		positionIndex,
		position: Position.Goalkeeper,
		player: formationSavedLayout.goalkeeper[0].player,
	});
	positionIndex += 1;

	for (let i = 0; i < formation.defenders; i++) {
		const defender = formationSavedLayout.defenders.find(
			(defender) => defender.positionIndex === positionIndex,
		);
		formationDraftLayout.defenders.push({
			positionIndex,
			position: Position.Defender,
			player: defender?.player,
		});
		positionIndex += 1;
	}

	for (let i = 0; i < formation.midfielders; i++) {
		const midfielder = formationSavedLayout.midFielders.find(
			(midfielder) => midfielder.positionIndex === positionIndex,
		);
		formationDraftLayout.midFielders.push({
			positionIndex,
			position: Position.Defender,
			player: midfielder?.player,
		});
		positionIndex += 1;
	}

	for (let i = 0; i < formation.forwards; i++) {
		const forward = formationSavedLayout.forwards.find(
			(forward) => forward.positionIndex === positionIndex,
		);
		formationDraftLayout.forwards.push({
			positionIndex,
			position: Position.Defender,
			player: forward?.player,
		});
		positionIndex += 1;
	}

	return formationDraftLayout;
};
