import { IFormationPlayer } from '@/interfaces/formation-player/IFormationPlayer.interface';
import { IPlayer } from '@/interfaces/player/IPlayer';

export interface IFormationPlayerPartial
	extends Partial<Omit<IFormationPlayer, 'player'>> {
	player?: IPlayer | null;
}

export interface IFormationLayout {
	goalkeeper: IFormationPlayerPartial[];
	forwards: IFormationPlayerPartial[];
	defenders: IFormationPlayerPartial[];
	midfielders: IFormationPlayerPartial[];
}
