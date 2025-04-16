import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ISubmitPlaceBidTransactionParams } from '@/interfaces/auction/ISubmitPlaceBidTransaction';
import { SUBMIT_PLACE_BID_SUCCESS_MESSAGE } from '@/interfaces/auction/auction-messages';
import { auctionService } from '@/services/auction.service';
import { notificationService } from '@/services/notification.service';

export const useSubmitPlaceBidTransaction = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: ISubmitPlaceBidTransactionParams) => {
			return await auctionService.submitPlaceBidTransaction(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['auctions'] });
			notificationService.success(SUBMIT_PLACE_BID_SUCCESS_MESSAGE);
		},
	});
};
