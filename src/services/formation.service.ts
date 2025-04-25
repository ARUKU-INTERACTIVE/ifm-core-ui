import {
	IListResponse,
	ISingleResponse,
} from './../interfaces/api/IApiBaseResponse';
import { ApiRequestConfig, apiService } from './api.service';

import { IGetAllConfig } from '@/interfaces/common/IGetAllConfig';
import { ICreateFormation } from '@/interfaces/formation/ICreateFormation.interface';
import { IFormation } from '@/interfaces/formation/IFormation.interface';
import { IGetAllFormationFilters } from '@/interfaces/formation/IGetAllFormation';
import { IApiService } from '@/interfaces/services/IApiService';
import { IFormationService } from '@/interfaces/services/IFormationService';

class FormationService implements IFormationService {
	api: IApiService<ApiRequestConfig>;
	constructor(api: IApiService<ApiRequestConfig>) {
		this.api = api;
	}

	async getAll({
		filters,
	}: IGetAllConfig<IGetAllFormationFilters>): Promise<
		IListResponse<IFormation>
	> {
		const queryParams = new URLSearchParams();

		if (filters) {
			Object.entries(filters).forEach(([key, value]) => {
				if (value) {
					queryParams.append(`filter[${key}]`, value);
				}
			});
		}

		return await this.api.get<IListResponse<IFormation>>('/formation', {
			params: queryParams,
		});
	}

	async saveFormation(
		createFormation: ICreateFormation,
	): Promise<ISingleResponse<IFormation>> {
		console.log(createFormation, 'createFormation');
		return await this.api.post<ISingleResponse<IFormation>>(
			'/formation',
			createFormation,
		);
	}

	async getFormationByUuid(
		formationUuid: string,
	): Promise<ISingleResponse<IFormation>> {
		return await this.api.get<ISingleResponse<IFormation>>(
			`/formation/${formationUuid}?include[fields]=formationPlayers`,
		);
	}
}

export const formationService = new FormationService(apiService);
