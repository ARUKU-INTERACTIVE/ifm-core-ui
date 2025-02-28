import { ISingleResponse } from '../api/IApiBaseResponse';
import { IRefreshSessionResponse } from '../auth/IRefreshSessionResponse';
import { ISignInResponse } from '../auth/ISignInResponse';
import { ISignUpResponse } from '../auth/ISignUpResponse';
import { ISuccessfulAuthenticationResponse } from '../auth/ISuccessfulAuthenticationResponse';

import { ApiRequestConfig } from '@/services/api.service';

export interface IAuthService {
	signUp: (
		username: string,
		password: string,
		config?: ApiRequestConfig,
	) => Promise<ISingleResponse<ISignUpResponse>>;
	signIn: (
		transactionSigned: string,
		publicKey: string,
		nonce: string,
	) => Promise<ISingleResponse<ISignInResponse>>;
	confirmUser: (
		username: string,
		code: string,
		config?: ApiRequestConfig,
	) => Promise<ISingleResponse<ISuccessfulAuthenticationResponse>>;
	confirmPassword: (
		username: string,
		newPassword: string,
		code: string,
		config?: ApiRequestConfig,
	) => Promise<ISingleResponse<ISuccessfulAuthenticationResponse>>;
	resendConfirmationCode: (
		username: string,
		config?: ApiRequestConfig,
	) => Promise<ISingleResponse<ISuccessfulAuthenticationResponse>>;
	forgotPassword: (
		username: string,
		config?: ApiRequestConfig,
	) => Promise<ISingleResponse<ISuccessfulAuthenticationResponse>>;
	refreshToken: (
		username: string,
		refreshToken: string,
		config?: ApiRequestConfig,
	) => Promise<ISingleResponse<IRefreshSessionResponse>>;
}
