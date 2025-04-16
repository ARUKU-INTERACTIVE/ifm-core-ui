import { useMutation } from '@tanstack/react-query';

import { IGetPlaceBidTransactionParams } from '@/interfaces/auction/IGetPlaceBidTransaction';
import { auctionService } from '@/services/auction.service';

export const useGetPlaceBidTransaction = () => {
	return useMutation({
		mutationFn: async (data: IGetPlaceBidTransactionParams) => {
			return await auctionService.getPlaceBidTransaction(data);
		},
	});
};
