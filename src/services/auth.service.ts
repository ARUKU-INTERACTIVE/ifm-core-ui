import { ApiRequestConfig, apiService } from './api.service';

import { ISingleResponse } from '@/interfaces/api/IApiBaseResponse';
import { IChallengeTransactionResponse } from '@/interfaces/auth/IChallengeTransactionResponse';
import { IRefreshSessionResponse } from '@/interfaces/auth/IRefreshSessionResponse';
import { ISignInResponse } from '@/interfaces/auth/ISignInResponse';
import { ISignUpResponse } from '@/interfaces/auth/ISignUpResponse';
import { ISuccessfulAuthenticationResponse } from '@/interfaces/auth/ISuccessfulAuthenticationResponse';
import { IApiService } from '@/interfaces/services/IApiService';
import { IAuthService } from '@/interfaces/services/IAuthService';

class AuthService implements IAuthService {
	api: IApiService<ApiRequestConfig>;
	constructor(api: IApiService<ApiRequestConfig>) {
		this.api = api;
	}
	async signIn(transactionSigned: string, publicKey: string, nonce: string) {
		return await this.api.post<ISingleResponse<ISignInResponse>>(
			'/auth/sign-in',
			{
				transactionSigned,
				publicKey,
				nonce,
			},
		);
	}
	async signUp(username: string, password: string, config?: ApiRequestConfig) {
		return await this.api.post<ISingleResponse<ISignUpResponse>>(
			'/auth/sign-up',
			{ username, password },
			config,
		);
	}
	async confirmUser(username: string, code: string, config?: ApiRequestConfig) {
		return await this.api.post<
			ISingleResponse<ISuccessfulAuthenticationResponse>
		>('/auth/confirm-user', { username, code }, config);
	}
	async confirmPassword(
		username: string,
		newPassword: string,
		code: string,
		config?: ApiRequestConfig,
	) {
		return await this.api.post<
			ISingleResponse<ISuccessfulAuthenticationResponse>
		>('/auth/confirm-password', { username, newPassword, code }, config);
	}
	async resendConfirmationCode(username: string, config?: ApiRequestConfig) {
		return await this.api.post<
			ISingleResponse<ISuccessfulAuthenticationResponse>
		>('/auth/resend-confirmation-code', { username }, config);
	}
	async forgotPassword(username: string, config?: ApiRequestConfig) {
		return await this.api.post<
			ISingleResponse<ISuccessfulAuthenticationResponse>
		>('/auth/forgot-password', { username }, config);
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
			console.error('[GET_CHALLENGE_TRANSACTION_ERROR]', err);
			throw new Error(err.message);
		}
	}
}

export const authService = new AuthService(apiService);
