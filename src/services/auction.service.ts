import { ApiRequestConfig, apiService } from './api.service';

import {
	IListResponse,
	ISingleResponse,
} from '@/interfaces/api/IApiBaseResponse';
import { ITransactionResponse } from '@/interfaces/api/ITransactionResponse';
import { IAuction } from '@/interfaces/auction/IAuction';
import { ICreateAuctionTransactionParams } from '@/interfaces/auction/ICreateAuctionTransaction';
import { IGetPlaceBidTransactionParams } from '@/interfaces/auction/IGetPlaceBidTransaction';
import { ISubmitCreateAuctionTransactionParams } from '@/interfaces/auction/ISubmitCreateAuction';
import { ISubmitPlaceBidTransactionParams } from '@/interfaces/auction/ISubmitPlaceBidTransaction';
import { IApiService } from '@/interfaces/services/IApiService';
import { IAuctionService } from '@/interfaces/services/IAuctionService';

class AuctionService implements IAuctionService {
	api: IApiService<ApiRequestConfig>;
	constructor(api: IApiService<ApiRequestConfig>) {
		this.api = api;
	}

	async getAll(): Promise<IListResponse<IAuction>> {
		return await this.api.get<IListResponse<IAuction>>(`/auction`);
	}

	async createAuctionTransaction(
		createAuctionTransactionParams: ICreateAuctionTransactionParams,
	): Promise<ISingleResponse<ITransactionResponse>> {
		return await this.api.post<ISingleResponse<ITransactionResponse>>(
			`/auction/create/transaction`,
			createAuctionTransactionParams,
		);
	}

	async submitCreateAuctionTransaction(
		submitCreateAuctionTransactionParams: ISubmitCreateAuctionTransactionParams,
	): Promise<ISingleResponse<IAuction>> {
		return await this.api.post<ISingleResponse<IAuction>>(
			`/auction/submit/transaction`,
			submitCreateAuctionTransactionParams,
		);
	}

	async getPlaceBidTransaction(
		getPlaceBidTransactionParams: IGetPlaceBidTransactionParams,
	): Promise<ISingleResponse<ITransactionResponse>> {
		return await this.api.post<ISingleResponse<ITransactionResponse>>(
			'/auction/create/transaction/place-bid',
			getPlaceBidTransactionParams,
		);
	}

	async submitPlaceBidTransaction(
		submitPlaceBidTransactionParams: ISubmitPlaceBidTransactionParams,
	): Promise<ISingleResponse<IAuction>> {
		return await this.api.post<ISingleResponse<IAuction>>(
			'/auction/submit/transaction/place-bid',
			submitPlaceBidTransactionParams,
		);
	}
}

export const auctionService = new AuctionService(apiService);
