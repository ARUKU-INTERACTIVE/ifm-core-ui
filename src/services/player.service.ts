import {
	IListResponse,
	ISingleResponse,
} from './../interfaces/api/IApiBaseResponse';
import { ApiRequestConfig, apiService } from './api.service';

import { ITransactionResponse } from '@/interfaces/api/ITransactionResponse';
import { IGetAllConfig } from '@/interfaces/common/IGetAllConfig';
import { IGetAllPlayersFilters } from '@/interfaces/player/IGetAllPlayers';
import {
	IMintPlayerParams,
	ISubmitMintPlayerParams,
} from '@/interfaces/player/IMintPlayer';
import { IPlayer } from '@/interfaces/player/IPlayer';
import { ITransactionNFTData } from '@/interfaces/player/ITransactionNFT';
import { IApiService } from '@/interfaces/services/IApiService';
import { IPlayerService } from '@/interfaces/services/IPlayerService';

class PlayerService implements IPlayerService {
	api: IApiService<ApiRequestConfig>;
	constructor(api: IApiService<ApiRequestConfig>) {
		this.api = api;
	}

	async getAll({
		filters,
	}: IGetAllConfig<IGetAllPlayersFilters>): Promise<IListResponse<IPlayer>> {
		const queryParams = new URLSearchParams();

		if (filters) {
			Object.entries(filters).forEach(([key, value]) => {
				if (value) {
					queryParams.append(`filter[${key}]`, value);
				}
			});
		}

		return await this.api.get<IListResponse<IPlayer>>('/player', {
			params: queryParams,
		});
	}

	async mintPlayerSac(
		playerId: string,
	): Promise<ISingleResponse<ITransactionResponse>> {
		try {
			return await this.api.post<ISingleResponse<ITransactionResponse>>(
				`/player/sac/${playerId}`,
				{},
			);
		} catch (error) {
			const err = error as Error;
			throw new Error(err.message);
		}
	}

	async submitPlayerSac(
		playerId: string,
		transactionXDR: string,
	): Promise<ISingleResponse<IPlayer>> {
		try {
			return await this.api.post<ISingleResponse<IPlayer>>(
				`/player/submit/sac/${playerId}`,
				{
					xdr: transactionXDR,
				},
			);
		} catch (error) {
			const err = error as Error;
			throw new Error(err.message);
		}
	}

	async mintPlayer(
		mintPlayerParams: IMintPlayerParams,
	): Promise<ISingleResponse<ITransactionNFTData>> {
		const formData = new FormData();
		if (mintPlayerParams.file) {
			formData.append('file', mintPlayerParams.file);
		}
		formData.append('name', mintPlayerParams.name);
		formData.append('description', mintPlayerParams.description);

		return await this.api.post<ISingleResponse<ITransactionNFTData>>(
			'/player/mint',
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			},
		);
	}

	async submitMintPlayer(
		submitMintPlayerParams: ISubmitMintPlayerParams,
	): Promise<ISingleResponse<IPlayer>> {
		return await this.api.post<ISingleResponse<IPlayer>>(
			'/player/submit/mint',
			submitMintPlayerParams,
		);
	}
}

export const playerService = new PlayerService(apiService);
