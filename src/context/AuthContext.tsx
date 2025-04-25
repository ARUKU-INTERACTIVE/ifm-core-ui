import { createContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import {
	SESSION_EXPIRED_ERROR,
	SIGN_IN_SUCCESS_MESSAGE,
	SIGN_OUT_SUCCESS_MESSAGE,
} from './auth-messages';

import { useLoadingState } from '@/hooks/auth/useAuthState';
import { IAuthenticationContext } from '@/interfaces/auth/IAuthenticationContext';
import { StoredCookies } from '@/interfaces/auth/cookies.enum';
import { apiService } from '@/services/api.service';
import { authService } from '@/services/auth.service';
import { cookieService } from '@/services/cookie.service';
import { notificationService } from '@/services/notification.service';

export const AuthContext = createContext<IAuthenticationContext | null>(null);
type PropTypes = { children: React.ReactNode };
export const AuthProvider = ({ children }: PropTypes) => {
	const { loadingState, setLoadingState } = useLoadingState();
	const navigate = useNavigate();
	const handleSignIn = useCallback(
		(transactionSigned: string, publicKey: string, memo: string) => {
			async function signIn(
				transactionSigned: string,
				publicKey: string,
				memo: string,
			) {
				setLoadingState('signIn', true);
				try {
					const signInResponse = await authService.signIn(
						transactionSigned,
						publicKey,
						memo,
					);
					const { accessToken, refreshToken } = signInResponse.data.attributes;

					cookieService.setAccessTokenCookie(accessToken);
					cookieService.setRefreshTokenCookie(refreshToken);
					apiService.setAuthentication(accessToken);
					notificationService.success(SIGN_IN_SUCCESS_MESSAGE);
					navigate('/team');
				} catch (error: unknown) {
					if (error instanceof Error) {
						notificationService.error(error.message);
					} else {
						notificationService.error(
							`Unknown error when requesting user confirmation: ${error}`,
						);
					}
				} finally {
					setLoadingState('signIn', false);
				}
			}
			return signIn(transactionSigned, publicKey, memo);
		},
		[setLoadingState, navigate],
	);

	const handleSignOut = useCallback(() => {
		cookieService.removeAll();
		notificationService.success(SIGN_OUT_SUCCESS_MESSAGE);
	}, []);

	const handleRefreshSession = useCallback(() => {
		async function refreshSession() {
			setLoadingState('refreshSession', true);
			try {
				const username = cookieService.getCookie(StoredCookies.USERNAME) || '';
				const accessToken =
					cookieService.getCookie(StoredCookies.ACCESS_TOKEN) || '';
				const refreshToken =
					cookieService.getCookie(StoredCookies.REFRESH_TOKEN) || '';
				if (!username || !refreshToken) {
					throw new Error(SESSION_EXPIRED_ERROR);
				}

				if (!accessToken) {
					const { data } = await authService.refreshToken(
						username,
						refreshToken,
					);
					cookieService.setAccessTokenCookie(accessToken);
					apiService.setAuthentication(data.attributes.accessToken);
				}
				setLoadingState('refreshSession', false);
			} catch (error) {
				navigate('auth/sign-in');
				if (error instanceof Error) notificationService.error(error.message);
				else
					notificationService.error(
						'Unexpected error while refreshing your session.\nPlease sign in again.',
					);
			}
		}
		return refreshSession();
	}, [setLoadingState, navigate]);

	const contextValue = {
		loadingState,
		handleRefreshSession,
		handleSignIn,
		handleSignOut,
	};
	return (
		<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
	);
};
