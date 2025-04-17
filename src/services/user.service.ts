import { ApiRequestConfig, apiService } from './api.service';

import { ISingleResponse } from '@/interfaces/api/IApiBaseResponse';
import { IUser } from '@/interfaces/api/IUser';
import { IApiService } from '@/interfaces/services/IApiService';
import { IUserService } from '@/interfaces/services/IUserService';

class UserService implements IUserService {
	api: IApiService<ApiRequestConfig>;
	constructor(api: IApiService<ApiRequestConfig>) {
		this.api = api;
	}

	async getMe(): Promise<ISingleResponse<IUser>> {
		return await this.api.get<ISingleResponse<IUser>>(`/user/me`);
	}
}

export const userService = new UserService(apiService);
