import { IFormationSpot } from './coordinates.interface';

import { IFormationPlayer } from '@/interfaces/formation-player/IFormationPlayer.interface';

export interface IFormationLayout {
	goalkeeper: IFormationSpot[];
	forwards: IFormationSpot[];
	defenders: IFormationSpot[];
	midfielders: IFormationSpot[];
}

export interface IFormationSavedLayout {
	goalkeeper: IFormationPlayer[];
	forwards: IFormationPlayer[];
	defenders: IFormationPlayer[];
	midfielders: IFormationPlayer[];
}
