import { IFormationStructure } from '../interfaces/IFormationStructure';
import { IFormationLayout } from '../interfaces/formation-players.interface';

import { Position } from '@/interfaces/formation-player/IFormationPlayer.interface';

export const calculatePlayerPositions = (
	formation: IFormationStructure,
): IFormationLayout => {
	const formationLayout: IFormationLayout = {
		defenders: [],
		midFielders: [],
		forwards: [],
		goalkeeper: [],
	};
	let positionIndex = 1;
	formationLayout.goalkeeper.push({
		positionIndex,
		position: Position.Goalkeeper,
	});
	positionIndex += 1;

	for (let i = 0; i < formation.defenders; i++) {
		formationLayout.defenders.push({
			positionIndex,
			position: Position.Defender,
		});
		positionIndex += 1;
	}

	for (let i = 0; i < formation.midFielders; i++) {
		formationLayout.midFielders.push({
			positionIndex,
			position: Position.Midfielder,
		});
		positionIndex += 1;
	}

	for (let i = 0; i < formation.forwards; i++) {
		formationLayout.forwards.push({
			positionIndex,
			position: Position.Forward,
		});
		positionIndex += 1;
	}

	return formationLayout;
};
