import { Position } from '@/interfaces/formation-player/IFormationPlayer.interface';
import { IPlayer } from '@/interfaces/player/IPlayer';

export interface IFormationSpot {
	positionIndex: number;
	position: Position;
	player?: IPlayer | null;
}
