import { ApiRequestConfig, apiService } from './api.service';

import {
	IListResponse,
	ISingleResponse,
} from '@/interfaces/api/IApiBaseResponse';
import { ITransactionResponse } from '@/interfaces/api/ITransactionResponse';
import { IAuction, IAuctionFilters } from '@/interfaces/auction/IAuction';
import { ICreateAuctionTransactionParams } from '@/interfaces/auction/ICreateAuctionTransaction';
import { IGetClaimTransactionParams } from '@/interfaces/auction/IGetClaimTransaction';
import { IGetPlaceBidTransactionParams } from '@/interfaces/auction/IGetPlaceBidTransaction';
import { ISubmitClaimTransactionParams } from '@/interfaces/auction/ISubmitClaimTransaction';
import { ISubmitCreateAuctionTransactionParams } from '@/interfaces/auction/ISubmitCreateAuction';
import { ISubmitPlaceBidTransactionParams } from '@/interfaces/auction/ISubmitPlaceBidTransaction';
import { IGetAllConfig } from '@/interfaces/common/IGetAllConfig';
import { IApiService } from '@/interfaces/services/IApiService';
import { IAuctionService } from '@/interfaces/services/IAuctionService';

class AuctionService implements IAuctionService {
	api: IApiService<ApiRequestConfig>;
	constructor(api: IApiService<ApiRequestConfig>) {
		this.api = api;
	}

	async getAll({
		page,
		filters,
	}: IGetAllConfig<IAuctionFilters>): Promise<IListResponse<IAuction>> {
		const queryParams = new URLSearchParams();

		if (filters) {
			Object.entries(filters).forEach(([key, value]) => {
				if (value) {
					queryParams.append(`filter[${key}]`, value);
				}
			});
		}

		if (page) {
			queryParams.append('page[number]', page.number.toString());
			queryParams.append('page[size]', page.size.toString());
		}

		return await this.api.get<IListResponse<IAuction>>(`/auction`, {
			params: queryParams,
		});
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

	async getClaimTransaction(
		getClaimTransactionParams: IGetClaimTransactionParams,
	): Promise<ISingleResponse<ITransactionResponse>> {
		return await this.api.post<ISingleResponse<ITransactionResponse>>(
			'/auction/create/transaction/claim',
			getClaimTransactionParams,
		);
	}

	async submitClaimTransaction(
		submitClaimTransactionParams: ISubmitClaimTransactionParams,
	): Promise<ISingleResponse<IAuction>> {
		return await this.api.post<ISingleResponse<IAuction>>(
			'/auction/submit/transaction/claim',
			submitClaimTransactionParams,
		);
	}
}

export const auctionService = new AuctionService(apiService);
