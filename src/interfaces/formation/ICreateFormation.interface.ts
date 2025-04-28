import { Position } from '../formation-player/IFormationPlayer.interface';

export interface ICreateFormationPlayer {
	position: Position;
	playerUuid: string;
	positionIndex: number;
}

export interface ICreateFormation {
	name: string;
	description: string;
	rosterUuid: string;
	forwards: number;
	midfielders: number;
	defenders: number;
	isActive?: boolean;
	formationPlayers: ICreateFormationPlayer[];
}
