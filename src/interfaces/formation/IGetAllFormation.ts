export interface IGetAllFormationFilters {
	name?: string;
	description?: string;
	rosterUuid?: string | null;
	rosterId?: number;
	forwards?: number;
	midfielders?: number;
	defenders?: number;
}
