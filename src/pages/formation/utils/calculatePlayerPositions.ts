import {
	IFormationLayout,
	IFormationPlayerPartial,
} from '../interfaces/IFormationPlayers';
import { IFormationSubset } from '../interfaces/IFormationSubset';

import { Position } from '@/interfaces/formation-player/IFormationPlayer.interface';

export const calculatePlayerPositions = (
	formation: IFormationSubset,
	formationLayout: IFormationLayout,
	isSavedFormation?: boolean,
): IFormationLayout => {
	const allPlayers = [];
	if (formationLayout) {
		allPlayers.push(
			...(formationLayout.defenders ?? []),
			...(formationLayout.midfielders ?? []),
			...(formationLayout.forwards ?? []),
		);
	}
	const draftFormationLayout: IFormationLayout = {
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

	if (formationLayout?.goalkeeper?.[0]?.player) {
		goalkeeper = {
			positionIndex,
			position: Position.Goalkeeper,
			player: formationLayout?.goalkeeper?.[0]?.player,
		};
		if (isSavedFormation) {
			goalkeeper = {
				...formationLayout.goalkeeper?.[0],
				...goalkeeper,
			};
		} else {
			goalkeeper = { ...goalkeeper, uuid: undefined };
		}
	}
	draftFormationLayout.goalkeeper.push(goalkeeper);
	positionIndex += 1;

	for (let i = 0; i < formation.defenders; i++) {
		const defender = formationLayout
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
				...defenderDraft,
				player: defender?.player,
			};
			if (isSavedFormation) {
				defenderDraft = {
					...defender,
					...defenderDraft,
				};
			} else {
				defenderDraft = { ...defenderDraft, uuid: undefined };
			}
		}
		draftFormationLayout.defenders.push(defenderDraft);
		positionIndex += 1;
	}

	for (let i = 0; i < formation.midfielders; i++) {
		const midfielder = formationLayout
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
				...midfielderDraft,
				player: midfielder?.player,
			};
			if (isSavedFormation) {
				midfielderDraft = {
					...midfielder,
					...midfielderDraft,
				};
			} else {
				midfielderDraft = { ...midfielderDraft, uuid: undefined };
			}
		}
		draftFormationLayout.midfielders.push(midfielderDraft);
		positionIndex += 1;
	}

	for (let i = 0; i < formation.forwards; i++) {
		const forward = formationLayout
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
				...forwardDraft,
				player: forward?.player,
			};
			if (isSavedFormation) {
				forwardDraft = {
					...forward,
					...forwardDraft,
				};
			} else {
				forwardDraft = { ...forwardDraft, uuid: undefined };
			}
		}
		draftFormationLayout.forwards.push(forwardDraft);
		positionIndex += 1;
	}

	return draftFormationLayout;
};
