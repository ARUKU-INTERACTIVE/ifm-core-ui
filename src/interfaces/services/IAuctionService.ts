import { IListResponse, ISingleResponse } from '../api/IApiBaseResponse';
import { ITransactionResponse } from '../api/ITransactionResponse';
import { IAuction } from '../auction/IAuction';
import { ICreateAuctionTransactionParams } from '../auction/ICreateAuctionTransaction';
import { ISubmitCreateAuctionTransactionParams } from '../auction/ISubmitCreateAuction';

export interface IAuctionService {
	getAll(): Promise<IListResponse<IAuction>>;
	createAuctionTransaction(
		params: ICreateAuctionTransactionParams,
	): Promise<ISingleResponse<ITransactionResponse>>;
	submitCreateAuctionTransaction(
		params: ISubmitCreateAuctionTransactionParams,
	): Promise<ISingleResponse<IAuction>>;
}
