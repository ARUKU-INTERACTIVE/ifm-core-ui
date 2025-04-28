import {
	IFormationLayout,
	IFormationPlayerPartial,
} from '../interfaces/IFormationPlayers';
import { IFormationSubset } from '../interfaces/IFormationSubset';

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
	let goalkeeper: IFormationPlayerPartial = {
		positionIndex,
		position: Position.Goalkeeper,
	};

	if (formationSavedLayout?.goalkeeper?.[0]?.player) {
		goalkeeper = {
			...formationLayout.goalkeeper?.[0],
			positionIndex,
			position: Position.Goalkeeper,
			player: formationSavedLayout?.goalkeeper?.[0]?.player,
		};
	}
	formationLayout.goalkeeper.push(goalkeeper);
	positionIndex += 1;

	for (let i = 0; i < formation.defenders; i++) {
		const defender = formationSavedLayout
			? allPlayers.find(
					(formationPlayer) => formationPlayer.positionIndex === positionIndex,
			  )
			: undefined;
		let defenderDraft: IFormationPlayerPartial = {
			positionIndex,
			position: Position.Defender,
		};
		if (defender) {
			defenderDraft = {
				...defender,
				positionIndex,
				position: Position.Defender,
				player: defender?.player,
			};
		}
		formationLayout.defenders.push(defenderDraft);
		positionIndex += 1;
	}

	for (let i = 0; i < formation.midfielders; i++) {
		const midfielder = formationSavedLayout
			? allPlayers.find(
					(formationPlayer) => formationPlayer.positionIndex === positionIndex,
			  )
			: undefined;
		let midfielderDraft: IFormationPlayerPartial = {
			positionIndex,
			position: Position.Midfielder,
		};
		if (midfielder) {
			midfielderDraft = {
				...midfielder,
				positionIndex,
				position: Position.Midfielder,
				player: midfielder?.player,
			};
		}
		formationLayout.midfielders.push(midfielderDraft);
		positionIndex += 1;
	}

	for (let i = 0; i < formation.forwards; i++) {
		const forward = formationSavedLayout
			? allPlayers.find(
					(formationPlayer) => formationPlayer.positionIndex === positionIndex,
			  )
			: undefined;
		let forwardDraft: IFormationPlayerPartial = {
			positionIndex,
			position: Position.Forward,
		};
		if (forward) {
			forwardDraft = {
				...forward,
				positionIndex,
				position: Position.Forward,
				player: forward?.player,
			};
		}
		formationLayout.forwards.push(forwardDraft);
		positionIndex += 1;
	}

	return formationLayout;
};
