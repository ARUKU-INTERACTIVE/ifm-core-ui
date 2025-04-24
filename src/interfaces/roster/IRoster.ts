import { IBaseEntity } from '../api/IBaseEntity';
import { IPlayer } from '../player/IPlayer';

export interface IRoster extends IBaseEntity {
	players: IPlayer[];
}
