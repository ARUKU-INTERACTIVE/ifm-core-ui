import { ISingleResponse } from '../interfaces/api/IApiBaseResponse';
import { ApiRequestConfig, apiService } from './api.service';

import { IPlayer } from '@/interfaces/player/IPlayer';
import { IRoster } from '@/interfaces/roster/IRoster';
import { IApiService } from '@/interfaces/services/IApiService';
import { IRosterService } from '@/interfaces/services/IRosterService';

class RoosterService implements IRosterService {
	api: IApiService<ApiRequestConfig>;
	constructor(api: IApiService<ApiRequestConfig>) {
		this.api = api;
	}

	async addPlayerToRoster(
		playerId: number,
		rosterId: string,
	): Promise<ISingleResponse<IPlayer>> {
		return await this.api.patch(`/player/add/roster`, {
			playerId,
			rosterId,
		});
	}

	async getAllPlayersFromRoster(
		rosterId: string,
	): Promise<ISingleResponse<IRoster>> {
		const queryParams = new URLSearchParams();

		queryParams.append('include[fields]', 'players');
		return await this.api.get(`/roster/${rosterId}`, {
			params: queryParams,
		});
	}

	async removePlayerFromRoster(
		playerId: number,
		rosterId: string,
	): Promise<ISingleResponse<IPlayer>> {
		return await this.api.patch(`/player/remove/roster`, {
			playerId,
			rosterId,
		});
	}
}

export const rosterService = new RoosterService(apiService);
