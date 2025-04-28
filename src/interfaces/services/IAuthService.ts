import { ISingleResponse } from '../api/IApiBaseResponse';
import { IRefreshSessionResponse } from '../auth/IRefreshSessionResponse';
import { ISignInResponse } from '../auth/ISignInResponse';

import { ApiRequestConfig } from '@/services/api.service';

export interface IAuthService {
	signIn: (
		transactionSigned: string,
		publicKey: string,
		memo: string,
	) => Promise<ISingleResponse<ISignInResponse>>;
	refreshToken: (
		username: string,
		refreshToken: string,
		config?: ApiRequestConfig,
	) => Promise<ISingleResponse<IRefreshSessionResponse>>;
}
