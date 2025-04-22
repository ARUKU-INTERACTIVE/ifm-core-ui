import { ISingleResponse } from './../interfaces/api/IApiBaseResponse';
import { ApiRequestConfig, apiService } from './api.service';

import { IApiService } from '@/interfaces/services/IApiService';
import { ITeamService } from '@/interfaces/services/ITeamService';
import { ICreateTeamParams } from '@/interfaces/team/ICreateTeam';
import { ITeam } from '@/interfaces/team/ITeam';

class TeamService implements ITeamService {
	api: IApiService<ApiRequestConfig>;
	constructor(api: IApiService<ApiRequestConfig>) {
		this.api = api;
	}

	async getTeamById(teamId: number): Promise<ISingleResponse<ITeam>> {
		try {
			return await this.api.get<ISingleResponse<ITeam>>(`/team/${teamId}`);
		} catch (error) {
			const err = error as Error;
			throw new Error(err.message);
		}
	}

	async createTeam(
		createTeamParams: ICreateTeamParams,
	): Promise<ISingleResponse<ITeam>> {
		try {
			return await this.api.post<ISingleResponse<ITeam>>(
				`/team`,
				createTeamParams,
			);
		} catch (error) {
			const err = error as Error;
			throw new Error(err.message);
		}
	}

	async updateTeamById(
		teamId: string,
		updateTeamParams: Partial<ICreateTeamParams>,
	): Promise<ISingleResponse<ITeam>> {
		try {
			return await this.api.put<ISingleResponse<ITeam>>(
				`/team/${teamId}`,
				updateTeamParams,
			);
		} catch (error) {
			const err = error as Error;
			throw new Error(err.message);
		}
	}
}

export const teamService = new TeamService(apiService);
