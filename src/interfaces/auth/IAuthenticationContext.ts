import { ILoadingState } from './ILoadingState';

export interface IAuthenticationContext {
	handleSignIn: (username: string, password: string) => Promise<void>;
	handleSignUp: (username: string, password: string) => Promise<void>;
	handleSignOut: () => void;
	handleConfirmUser: (username: string, code: string) => Promise<void>;
	handleResendConfirmationCode: (username: string) => Promise<void>;
	handleForgotPassword: (username: string) => Promise<void>;
	handleConfirmPassword: (
		username: string,
		newPassword: string,
		code: string,
	) => Promise<void>;
	handleRefreshSession: () => Promise<void>;
	loadingState: ILoadingState;
}
