import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ISubmitClaimTransactionParams } from '@/interfaces/auction/ISubmitClaimTransaction';
import { SUBMIT_CLAIM_TRANSACTION_SUCCESS_MESSAGE } from '@/interfaces/auction/auction-messages';
import { auctionService } from '@/services/auction.service';
import { notificationService } from '@/services/notification.service';

export const useSubmitClaimTransaction = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: ISubmitClaimTransactionParams) => {
			return await auctionService.submitClaimTransaction(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['auctions'] });
			notificationService.success(SUBMIT_CLAIM_TRANSACTION_SUCCESS_MESSAGE);
		},
	});
};
