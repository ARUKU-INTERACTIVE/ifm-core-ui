import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ISubmitCreateAuctionTransactionParams } from '@/interfaces/auction/ISubmitCreateAuction';
import { SUBMIT_CREATE_AUCTION_SUCCESS_MESSAGE } from '@/interfaces/auction/auction-messages';
import { auctionService } from '@/services/auction.service';
import { notificationService } from '@/services/notification.service';

export const useSubmitCreateAuctionTransaction = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: ISubmitCreateAuctionTransactionParams) => {
			return await auctionService.submitCreateAuctionTransaction(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['auctions'],
			});
			queryClient.invalidateQueries({
				queryKey: ['players'],
			});
			notificationService.success(SUBMIT_CREATE_AUCTION_SUCCESS_MESSAGE);
		},
	});
};
