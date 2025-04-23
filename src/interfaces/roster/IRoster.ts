import { IPlayer } from '../player/IPlayer';

export interface IRoster {
	id: number;
	uuid: string;
	players: IPlayer[];
	createdAt: string;
	updatedAt: string;
}
