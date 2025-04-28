import { IListResponse, ISingleResponse } from '../api/IApiBaseResponse';
import { IGetAllConfig } from '../common/IGetAllConfig';
import { ICreateFormation } from '../formation/ICreateFormation.interface';
import { IFormation } from '../formation/IFormation.interface';
import { IGetAllPlayersFilters } from '../player/IGetAllPlayers';

export interface IFormationService {
	getAll(
		filters: IGetAllConfig<IGetAllPlayersFilters>,
	): Promise<IListResponse<IFormation>>;
	saveFormation(
		createFormationParams: ICreateFormation,
	): Promise<ISingleResponse<IFormation>>;
	getFormationByUuid(
		formationUuid: string,
	): Promise<ISingleResponse<IFormation>>;
}
