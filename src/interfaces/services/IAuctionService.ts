import { IListResponse, ISingleResponse } from '../api/IApiBaseResponse';
import { ITransactionResponse } from '../api/ITransactionResponse';
import { IAuction } from '../auction/IAuction';
import { ICreateAuctionTransactionParams } from '../auction/ICreateAuctionTransaction';
import { IGetPlaceBidTransactionParams } from '../auction/IGetPlaceBidTransaction';
import { ISubmitCreateAuctionTransactionParams } from '../auction/ISubmitCreateAuction';
import { ISubmitPlaceBidTransactionParams } from '../auction/ISubmitPlaceBidTransaction';

export interface IAuctionService {
	getAll(): Promise<IListResponse<IAuction>>;
	createAuctionTransaction(
		params: ICreateAuctionTransactionParams,
	): Promise<ISingleResponse<ITransactionResponse>>;
	submitCreateAuctionTransaction(
		params: ISubmitCreateAuctionTransactionParams,
	): Promise<ISingleResponse<IAuction>>;
	getPlaceBidTransaction(
		getPlaceBidTransactionParams: IGetPlaceBidTransactionParams,
	): Promise<ISingleResponse<ITransactionResponse>>;
	submitPlaceBidTransaction(
		submitPlaceBidTransactionParams: ISubmitPlaceBidTransactionParams,
	): Promise<ISingleResponse<IAuction>>;
}
