import { IListResponse } from './../interfaces/api/IApiBaseResponse';
import { ApiRequestConfig, apiService } from './api.service';

import { IPlayer } from '@/interfaces/player/IPlayer';
import { IApiService } from '@/interfaces/services/IApiService';
import { IPlayerService } from '@/interfaces/services/IPlayerService';

class PlayerService implements IPlayerService {
	api: IApiService<ApiRequestConfig>;
	constructor(api: IApiService<ApiRequestConfig>) {
		this.api = api;
	}

	async getAll(
		name: string,
		isInAuction: boolean,
	): Promise<IListResponse<IPlayer>> {
		let queryParams = '';

		if (name) {
			queryParams += `filter[name]=${name}`;
		}

		if (isInAuction) {
			queryParams += queryParams
				? `&filter[isInAuction]=${isInAuction}`
				: `filter[isInAuction]=${isInAuction}`;
		}

		return await this.api.get<IListResponse<IPlayer>>(`/player${queryParams}`);
	}
}

export const playerService = new PlayerService(apiService);
