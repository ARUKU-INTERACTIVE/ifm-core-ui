import {
	ICreateFormation,
	ICreateFormationPlayer,
	ICreateFormationPlayerUuid,
} from './ICreateFormation.interface';

export interface IUpdateFormationPlayer
	extends Partial<ICreateFormationPlayer> {
	formationPlayerUuid?: string;
}
export interface IUpdateFormation
	extends Partial<Omit<ICreateFormation, 'rosterUuid' | 'formationPlayers'>> {
	formationUuid: string;
	formationPlayers: IUpdateFormationPlayer[];
	newFormationPlayers?: ICreateFormationPlayerUuid[];
}
