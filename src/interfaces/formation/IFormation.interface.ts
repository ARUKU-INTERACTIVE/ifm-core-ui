import { IBaseEntity } from '../api/IBaseEntity';
import { IFormationPlayer } from '../formation-player/IFormationPlayer.interface';
import { IRoster } from '../roster/IRoster';

export interface IFormation extends IBaseEntity {
	name: string;
	description: string;
	forwards: number;
	midfielders: number;
	defenders: number;
	roster: IRoster;
	rosterId: number;
	isActive?: boolean;
	formationPlayers: IFormationPlayer[];
}
