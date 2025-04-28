import { Position } from '../formation-player/IFormationPlayer.interface';

export interface ICreateFormationPlayer {
	position: Position;
	positionIndex: number;
}

export interface ICreateFormationPlayerUuid extends ICreateFormationPlayer {
	playerUuid: string;
	formationPlayerUuid?: string;
}

export interface ICreateFormation {
	name: string;
	description?: string;
	rosterUuid: string;
	forwards: number;
	midfielders: number;
	defenders: number;
	isActive?: boolean;
	formationPlayers: ICreateFormationPlayerUuid[];
}
