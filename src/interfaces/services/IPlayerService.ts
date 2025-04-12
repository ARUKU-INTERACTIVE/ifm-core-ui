import { IListResponse, ISingleResponse } from '../api/IApiBaseResponse';
import { ITransactionResponse } from '../api/ITransactionResponse';
import { IGetAllConfig } from '../common/IGetAllConfig';
import { IGetAllPlayersFilters } from '../player/IGetAllPlayers';
import { IPlayer } from '../player/IPlayer';

export interface IPlayerService {
	getAll(
		filters: IGetAllConfig<IGetAllPlayersFilters>,
	): Promise<IListResponse<IPlayer>>;
	mintPlayerSac(
		playerId: string,
	): Promise<ISingleResponse<ITransactionResponse>>;
	submitPlayerSac(
		playerId: string,
		transactionXDR: string,
	): Promise<ISingleResponse<IPlayer>>;
}
