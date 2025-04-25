import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import Cookies from 'universal-cookie';

import { ApiResponseError } from '@/errors/ApiResponseError';
import { IHTTPRequestService } from '@/interfaces/IHTTPRequestService';
import { ISingleResponse } from '@/interfaces/api/IApiBaseResponse';
import { IApiResponseError } from '@/interfaces/api/IApiResponseError';
import { IRefreshSessionResponse } from '@/interfaces/auth/IRefreshSessionResponse';
import { normalizeString } from '@/utils/normalize-string';

const accessToken = new Cookies('accessToken', { path: '/' });
const refreshToken = new Cookies('refreshToken', { path: '/' });
const publicKey = new Cookies('publicKey', { path: '/' });

function createErrorHandler(instance: AxiosInstance) {
	return async function handleAxiosError(
		error: unknown | Error | AxiosError<IApiResponseError>,
	) {
		if (!axios.isAxiosError<IApiResponseError>(error) || !error.response)
			return Promise.reject(error);

		const originalRequest = error.config;
		const { data, status } = error.response;
		const shouldRefresh =
			status === 401 &&
			normalizeString(data.error.title) === normalizeString('Token expired');

		if (shouldRefresh && originalRequest) {
			const { data: refreshResponse } = await instance.post<
				ISingleResponse<IRefreshSessionResponse>
			>('/auth/refresh', {
				publicKey: publicKey.get('publicKey'),
				refreshToken: refreshToken.get('refreshToken'),
			});
			accessToken.set(
				'accessToken',
				refreshResponse.data.attributes.accessToken,
			);
			const authorization = `Bearer ${refreshResponse.data.attributes.accessToken}`;
			instance.defaults.headers.common['Authorization'] = authorization;
			originalRequest.headers.Authorization = authorization;
			return instance(originalRequest);
		}
		return Promise.reject(
			new ApiResponseError(
				data.error.detail,
				data.error.source,
				data.error.status,
				data.error.title,
			),
		);
	};
}

export const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	headers: {
		common: { Authorization: `Bearer ${accessToken.get('accessToken')}` },
	},
});

axiosInstance.interceptors.response.use(
	(response) => response,
	createErrorHandler(axiosInstance),
);

function createAxiosService(
	instance: AxiosInstance,
): IHTTPRequestService<AxiosRequestConfig> {
	return {
		get: async <T,>(url: string, config?: AxiosRequestConfig): Promise<T> => {
			const response = await instance.get<T>(url, config);
			return response.data;
		},
		post: async <T, K = unknown>(
			url: string,
			body: K,
			config?: AxiosRequestConfig,
		): Promise<T> => {
			const response = await instance.post<T>(url, body, config);
			return response.data;
		},
		patch: async <T, K = unknown>(
			url: string,
			body: K,
			config?: AxiosRequestConfig,
		): Promise<T> => {
			const response = await axiosInstance.patch(url, body, config);
			return response.data;
		},
		put: async <T, K = unknown>(
			url: string,
			body: K,
			config?: AxiosRequestConfig,
		): Promise<T> => {
			const response = await axiosInstance.put(url, body, config);
			return response.data;
		},
		delete: async <T,>(
			url: string,
			config?: AxiosRequestConfig,
		): Promise<T> => {
			const response = await axiosInstance.delete<T>(url, config);
			return response.data;
		},
		setAuthentication: (token: string) => {
			instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
			return;
		},
	};
}

export const axiosService = createAxiosService(axiosInstance);
