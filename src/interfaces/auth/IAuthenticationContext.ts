import { ILoadingState } from './ILoadingState';

export interface IAuthenticationContext {
	handleSignIn: (
		transactionSigned: string,
		publicKey: string,
		memo: string,
	) => Promise<void>;
	handleSignOut: () => void;
	handleRefreshSession: () => Promise<void>;
	loadingState: ILoadingState;
}
