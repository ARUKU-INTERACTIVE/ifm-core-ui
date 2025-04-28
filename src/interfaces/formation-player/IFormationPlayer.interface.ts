import { IBaseEntity } from '../api/IBaseEntity';
import { IFormation } from '../formation/IFormation.interface';
import { IPlayer } from '../player/IPlayer';

export enum Position {
	Goalkeeper = 'Goalkeeper',
	Defender = 'Defender',
	Midfielder = 'Midfielder',
	Forward = 'Forward',
}

export interface IFormationPlayer extends IBaseEntity {
	player: IPlayer;
	playerId: number;
	formation: IFormation;
	formationId: number;
	position: Position;
	positionIndex: number;
}
