import { useMutation } from '@tanstack/react-query';

import { ICreateAuctionTransactionParams } from '@/interfaces/auction/ICreateAuctionTransaction';
import { auctionService } from '@/services/auction.service';

export const useCreateAuctionTransaction = () => {
	return useMutation({
		mutationFn: async (data: ICreateAuctionTransactionParams) => {
			return await auctionService.createAuctionTransaction(data);
		},
	});
};
