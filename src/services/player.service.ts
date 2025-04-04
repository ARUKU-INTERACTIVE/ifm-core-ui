import { IListResponse } from './../interfaces/api/IApiBaseResponse';
import { ApiRequestConfig, apiService } from './api.service';

import { IGetAllConfig } from '@/interfaces/common/IGetAllConfig';
import { IGetAllPlayersFilters } from '@/interfaces/player/IGetAllPlayers';
import { IPlayer } from '@/interfaces/player/IPlayer';
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
}

export const playerService = new PlayerService(apiService);
