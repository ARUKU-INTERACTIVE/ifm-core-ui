import { IFormationSubset } from '../interfaces/IFormationSubset';
import {
	IFormationLayout,
	IFormationSavedLayout,
} from '../interfaces/formation-players.interface';

import { Position } from '@/interfaces/formation-player/IFormationPlayer.interface';

export const calculatePlayerPositions = (
	formation: IFormationSubset,
): IFormationLayout => {
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
	});
	positionIndex += 1;

	for (let i = 0; i < formation.defenders; i++) {
		formationLayout.defenders.push({
			positionIndex,
			position: Position.Defender,
		});
		positionIndex += 1;
	}

	for (let i = 0; i < formation.midfielders; i++) {
		formationLayout.midfielders.push({
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

export const calculatePlayerPosition = (
	formation: IFormationSubset,
	formationSavedLayout?: IFormationSavedLayout, // Formato guardado opcional
): IFormationLayout => {
	const formationLayout: IFormationLayout = {
		defenders: [],
		midfielders: [],
		forwards: [],
		goalkeeper: [],
	};
	let positionIndex = 1;

	// Agregar portero
	formationLayout.goalkeeper.push({
		positionIndex,
		position: Position.Goalkeeper,
		player: formationSavedLayout?.goalkeeper[0]?.player, // Si hay un jugador, se asigna
	});
	positionIndex += 1;

	// Agregar defensores
	for (let i = 0; i < formation.defenders; i++) {
		const defender = formationSavedLayout
			? formationSavedLayout.defenders.find(
					(defender) => defender.positionIndex === positionIndex,
			  )
			: undefined;
		formationLayout.defenders.push({
			positionIndex,
			position: Position.Defender,
			player: defender?.player, // Si hay un jugador, se asigna
		});
		positionIndex += 1;
	}

	// Agregar mediocampistas
	for (let i = 0; i < formation.midfielders; i++) {
		const midfielder = formationSavedLayout
			? formationSavedLayout.midfielders.find(
					(midfielder) => midfielder.positionIndex === positionIndex,
			  )
			: undefined;
		formationLayout.midfielders.push({
			positionIndex,
			position: Position.Midfielder,
			player: midfielder?.player, // Si hay un jugador, se asigna
		});
		positionIndex += 1;
	}

	// Agregar delanteros
	for (let i = 0; i < formation.forwards; i++) {
		const forward = formationSavedLayout
			? formationSavedLayout.forwards.find(
					(forward) => forward.positionIndex === positionIndex,
			  )
			: undefined;
		formationLayout.forwards.push({
			positionIndex,
			position: Position.Forward,
			player: forward?.player, // Si hay un jugador, se asigna
		});
		positionIndex += 1;
	}

	return formationLayout;
};
