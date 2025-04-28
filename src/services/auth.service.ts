import { ApiRequestConfig, apiService } from './api.service';

import { ISingleResponse } from '@/interfaces/api/IApiBaseResponse';
import { IChallengeTransactionResponse } from '@/interfaces/auth/IChallengeTransactionResponse';
import { IRefreshSessionResponse } from '@/interfaces/auth/IRefreshSessionResponse';
import { ISignInResponse } from '@/interfaces/auth/ISignInResponse';
import { IApiService } from '@/interfaces/services/IApiService';
import { IAuthService } from '@/interfaces/services/IAuthService';

class AuthService implements IAuthService {
	api: IApiService<ApiRequestConfig>;
	constructor(api: IApiService<ApiRequestConfig>) {
		this.api = api;
	}
	async signIn(transactionSigned: string, publicKey: string, memo: string) {
		return await this.api.post<ISingleResponse<ISignInResponse>>(
			'/auth/sign-in',
			{
				transactionSigned,
				publicKey,
				memo,
			},
		);
	}

	async refreshToken(
		username: string,
		refreshToken: string,
		config?: ApiRequestConfig,
	) {
		return await this.api.post<ISingleResponse<IRefreshSessionResponse>>(
			'/auth/refresh',
			{ username, refreshToken },
			config,
		);
	}
	async getChallengeTransaction(publicKey: string) {
		try {
			const queryParam = `?publicKey=${publicKey}`;

			return await this.api.get<ISingleResponse<IChallengeTransactionResponse>>(
				`/auth/challenge${queryParam}`,
			);
		} catch (error) {
			const err = error as Error;
			throw new Error(err.message);
		}
	}
}

export const authService = new AuthService(apiService);
