import { IListResponse, ISingleResponse } from '../api/IApiBaseResponse';
import { IGetAllConfig } from '../common/IGetAllConfig';
import { IGetAllPlayersFilters } from '../player/IGetAllPlayers';
import {
	IMintPlayerParams,
	ISubmitMintPlayerParams,
} from '../player/IMintPlayer';
import { IPlayer } from '../player/IPlayer';
import { ITransactionNFTData } from '../player/ITransactionNFT';

export interface IPlayerService {
	getAll(
		filters: IGetAllConfig<IGetAllPlayersFilters>,
	): Promise<IListResponse<IPlayer>>;
	mintPlayer(
		mintPlayerParams: IMintPlayerParams,
	): Promise<ISingleResponse<ITransactionNFTData>>;
	submitMintPlayer(
		submitMintPlayerParams: ISubmitMintPlayerParams,
	): Promise<ISingleResponse<IPlayer>>;
}
