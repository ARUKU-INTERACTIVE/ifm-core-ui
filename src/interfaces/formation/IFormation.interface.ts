import { IBaseEntity } from '../api/IBaseEntity';
import { IFormationPlayer } from '../formation-player/IFormationPlayer.interface';

export interface IFormation extends IBaseEntity {
	name: string;
	description: string;
	forwards: number;
	midfielders: number;
	defenders: number;
	roster: any;
	rosterId: number;
	formationPlayers: IFormationPlayer[];
}
