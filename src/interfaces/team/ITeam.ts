import { IBaseEntity } from '../api/IBaseEntity';

export interface ITeam extends IBaseEntity {
	name: string;
	logoUri: string;
	rosterId?: string;
}
