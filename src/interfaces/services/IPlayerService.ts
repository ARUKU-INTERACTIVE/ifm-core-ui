import { IListResponse, ISingleResponse } from '../api/IApiBaseResponse';
import { ITransactionResponse } from '../api/ITransactionResponse';
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
	getPlayerSACTransaction(
		playerId: string,
	): Promise<ISingleResponse<ITransactionResponse>>;
	submitPlayerSac(
		playerId: string,
		transactionXDR: string,
	): Promise<ISingleResponse<IPlayer>>;
	syncPlayers(): Promise<void>;
}
