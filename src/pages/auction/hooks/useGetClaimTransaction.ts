import { useMutation } from '@tanstack/react-query';

import { IGetClaimTransactionParams } from '@/interfaces/auction/IGetClaimTransaction';
import { GET_CLAIM_TRANSACTION_SUCCESS_MESSAGE } from '@/interfaces/auction/auction-messages';
import { auctionService } from '@/services/auction.service';
import { notificationService } from '@/services/notification.service';

export const useGetClaimTransaction = () => {
	return useMutation({
		mutationFn: async (data: IGetClaimTransactionParams) => {
			return await auctionService.getClaimTransaction(data);
		},
		onSuccess: () => {
			notificationService.success(GET_CLAIM_TRANSACTION_SUCCESS_MESSAGE);
		},
	});
};
