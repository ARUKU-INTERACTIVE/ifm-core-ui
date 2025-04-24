import { ISingleResponse } from '../interfaces/api/IApiBaseResponse';
import { ApiRequestConfig, apiService } from './api.service';

import { IPlayer } from '@/interfaces/player/IPlayer';
import { IRoster } from '@/interfaces/roster/IRoster';
import { IApiService } from '@/interfaces/services/IApiService';
import { IRosterService } from '@/interfaces/services/IRosterService';

class RosterService implements IRosterService {
	api: IApiService<ApiRequestConfig>;
	constructor(api: IApiService<ApiRequestConfig>) {
		this.api = api;
	}

	async addPlayerToRoster(
		playerId: string,
		rosterId: string,
	): Promise<ISingleResponse<IPlayer>> {
		return await this.api.patch(`/roster/${rosterId}/player/${playerId}`, {});
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
		playerId: string,
		rosterId: string,
	): Promise<ISingleResponse<IPlayer>> {
		return await this.api.delete(`/roster/${rosterId}/player/${playerId}`);
	}
}

export const rosterService = new RosterService(apiService);
