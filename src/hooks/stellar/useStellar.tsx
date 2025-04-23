import { useState } from 'react';

import {
	CREATE_ADD_TRUSTLINE_TRANSACTION_XDR_ERROR_MESSAGE,
	CREATE_ADD_TRUSTLINE_TRANSACTION_XDR_SUCCESS_MESSAGE,
	SUBMIT_TRANSACTION_XDR_ERROR_MESSAGE,
} from './stellar-messages';

import { STELLAR_DEFAULT_PLAYER_CODE } from '@/constants/environment';
import { notificationService } from '@/services/notification.service';
import { stellarService } from '@/services/stellar.service';

export const useStellar = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const tokenCode = STELLAR_DEFAULT_PLAYER_CODE;

	const handleCreateAddTrustlineTransactionXDR = async (
		accountAddress: string,
		tokenIssuer: string,
	) => {
		try {
			setIsLoading(true);
			const transactionXdr =
				await stellarService.createAddTrustlineTransactionXDR(
					accountAddress,
					tokenIssuer,
					tokenCode,
				);

			notificationService.success(
				CREATE_ADD_TRUSTLINE_TRANSACTION_XDR_SUCCESS_MESSAGE,
			);
			return transactionXdr;
		} catch (error) {
			notificationService.error(
				CREATE_ADD_TRUSTLINE_TRANSACTION_XDR_ERROR_MESSAGE,
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmitTransactionXDR = async (xdr: string) => {
		try {
			setIsLoading(true);

			return await stellarService.submitTransactionXDR(xdr);
		} catch (error) {
			notificationService.error(SUBMIT_TRANSACTION_XDR_ERROR_MESSAGE);
		} finally {
			setIsLoading(false);
		}
	};

	return {
		isLoading,
		handleCreateAddTrustlineTransactionXDR,
		handleSubmitTransactionXDR,
	};
};
