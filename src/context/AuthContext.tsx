import { createContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import {
	CONFIRMATION_SENT_MESSAGE,
	SESSION_EXPIRED_ERROR,
	SIGN_IN_SUCCESS_MESSAGE,
	SIGN_OUT_SUCCESS_MESSAGE,
	SIGN_UP_SUCCESS_MESSAGE,
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
		(transactionSigned: string, publicKey: string, nonce: string) => {
			async function signIn(
				transactionSigned: string,
				publicKey: string,
				nonce: string,
			) {
				setLoadingState('signIn', true);
				try {
					const { accessToken, refreshToken } = await authService.signIn(
						transactionSigned,
						publicKey,
						nonce,
					);

					cookieService.setAccessTokenCookie(accessToken);
					cookieService.setRefreshTokenCookie(refreshToken);
					apiService.setAuthentication(accessToken);
					notificationService.success(SIGN_IN_SUCCESS_MESSAGE);
					navigate('/about');
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
			return signIn(transactionSigned, publicKey, nonce);
		},
		[setLoadingState, navigate],
	);

	const handleSignUp = useCallback(
		(username: string, password: string) => {
			async function signUp(username: string, password: string) {
				setLoadingState('signUp', true);
				try {
					await authService.signUp(username, password);
					notificationService.success(CONFIRMATION_SENT_MESSAGE);
					notificationService.success(SIGN_UP_SUCCESS_MESSAGE);
					navigate('/auth/confirm-user');
				} catch (error: unknown) {
					if (error instanceof Error) {
						notificationService.error(error.message);
					} else {
						notificationService.error(
							`Unknown error when signing up: ${error}`,
						);
					}
				} finally {
					setLoadingState('signUp', false);
				}
			}
			return signUp(username, password);
		},
		[setLoadingState, navigate],
	);

	const handleConfirmUser = useCallback(
		(username: string, code: string) => {
			async function confirmUser(username: string, code: string) {
				setLoadingState('confirmUser', true);
				try {
					const { data } = await authService.confirmUser(username, code);
					notificationService.success(data.attributes.message);
					navigate('/auth/sign-in');
				} catch (error: unknown) {
					if (error instanceof Error) {
						notificationService.error(error.message);
					} else {
						notificationService.error(
							`Unknown error when requesting user confirmation: ${error}`,
						);
					}
				} finally {
					setLoadingState('confirmUser', false);
				}
			}
			return confirmUser(username, code);
		},
		[setLoadingState, navigate],
	);

	const handleSignOut = useCallback(() => {
		cookieService.removeAll();
		notificationService.success(SIGN_OUT_SUCCESS_MESSAGE);
	}, []);

	const handleForgotPassword = useCallback(
		(username: string) => {
			async function forgotPassword(username: string) {
				setLoadingState('forgotPassword', true);
				try {
					const { data } = await authService.forgotPassword(username);
					notificationService.success(data.attributes.message);
				} catch (error: unknown) {
					if (error instanceof Error) {
						notificationService.error(error.message);
					} else {
						notificationService.error(
							`Unknown error when requesting password change: ${error}`,
						);
					}
				} finally {
					setLoadingState('forgotPassword', false);
				}
			}
			return forgotPassword(username);
		},
		[setLoadingState],
	);

	const handleConfirmPassword = useCallback(
		(username: string, newPassword: string, code: string) => {
			async function confirmPassword(
				username: string,
				newPassword: string,
				code: string,
			) {
				setLoadingState('confirmPassword', true);
				try {
					const { data } = await authService.confirmPassword(
						username,
						newPassword,
						code,
					);
					notificationService.success(data.attributes.message);
					navigate('/auth/sign-in');
				} catch (error: unknown) {
					if (error instanceof Error) {
						notificationService.error(error.message);
					} else {
						notificationService.error(
							`Unknown error when requesting password change confirmation: ${error}`,
						);
					}
				} finally {
					setLoadingState('confirmPassword', false);
				}
			}
			return confirmPassword(username, newPassword, code);
		},
		[setLoadingState, navigate],
	);

	const handleResendConfirmationCode = useCallback(
		(username: string) => {
			async function resendConfirmationCode(username: string) {
				setLoadingState('resendConfirmationCode', true);
				try {
					const { data } = await authService.resendConfirmationCode(username);
					notificationService.success(data.attributes.message);
					navigate('/auth/confirm-user');
				} catch (error: unknown) {
					if (error instanceof Error) {
						notificationService.error(error.message);
					} else {
						notificationService.error(
							`Unknown error when requesting password change confirmation: ${error}`,
						);
					}
				} finally {
					setLoadingState('resendConfirmationCode', false);
				}
			}
			return resendConfirmationCode(username);
		},
		[setLoadingState, navigate],
	);

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
		handleConfirmPassword,
		handleConfirmUser,
		handleForgotPassword,
		handleRefreshSession,
		handleResendConfirmationCode,
		handleSignIn,
		handleSignOut,
		handleSignUp,
	};
	return (
		<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
	);
};
