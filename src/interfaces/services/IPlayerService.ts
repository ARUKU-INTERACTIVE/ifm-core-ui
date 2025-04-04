import { IListResponse } from '../api/IApiBaseResponse';
import { IGetAllConfig } from '../common/IGetAllConfig';
import { IGetAllPlayersFilters } from '../player/IGetAllPlayers';
import { IPlayer } from '../player/IPlayer';

export interface IPlayerService {
	getAll(
		filters: IGetAllConfig<IGetAllPlayersFilters>,
	): Promise<IListResponse<IPlayer>>;
}
