import { IFormationSubset } from '../interfaces/IFormationSubset';
import { IFormationLayout } from '../interfaces/formation-players.interface';

import { Position } from '@/interfaces/formation-player/IFormationPlayer.interface';

export const calculatePlayerPositions = (
	formation: IFormationSubset,
	formationSavedLayout?: IFormationLayout,
): IFormationLayout => {
	const allPlayers = [];
	if (formationSavedLayout) {
		allPlayers.push(
			...(formationSavedLayout.defenders ?? []),
			...(formationSavedLayout.midfielders ?? []),
			...(formationSavedLayout.forwards ?? []),
		);
	}
	const formationLayout: IFormationLayout = {
		defenders: [],
		midfielders: [],
		forwards: [],
		goalkeeper: [],
	};
	let positionIndex = 1;

	formationLayout.goalkeeper.push({
		positionIndex,
		position: Position.Goalkeeper,
		player: formationSavedLayout?.goalkeeper?.[0]?.player,
	});
	positionIndex += 1;

	for (let i = 0; i < formation.defenders; i++) {
		const defender = formationSavedLayout
			? allPlayers.find(
					(formationPlayer) => formationPlayer.positionIndex === positionIndex,
			  )
			: undefined;
		formationLayout.defenders.push({
			positionIndex,
			position: Position.Defender,
			player: defender?.player,
		});
		positionIndex += 1;
	}

	for (let i = 0; i < formation.midfielders; i++) {
		const midfielder = formationSavedLayout
			? allPlayers.find(
					(formationPlayer) => formationPlayer.positionIndex === positionIndex,
			  )
			: undefined;
		formationLayout.midfielders.push({
			positionIndex,
			position: Position.Midfielder,
			player: midfielder?.player,
		});
		positionIndex += 1;
	}

	for (let i = 0; i < formation.forwards; i++) {
		const forward = formationSavedLayout
			? allPlayers.find(
					(formationPlayer) => formationPlayer.positionIndex === positionIndex,
			  )
			: undefined;
		formationLayout.forwards.push({
			positionIndex,
			position: Position.Forward,
			player: forward?.player,
		});
		positionIndex += 1;
	}

	return formationLayout;
};
