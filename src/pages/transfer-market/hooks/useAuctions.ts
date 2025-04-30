import { useQuery } from '@tanstack/react-query';

import { IGetAllAuctionsParams } from '@/interfaces/auction/IAuction';
import { auctionService } from '@/services/auction.service';

export const useAuctions = (params: IGetAllAuctionsParams) => {
	return useQuery({
		queryKey: ['auctions', params],
		queryFn: () => auctionService.getAll(params),
	});
};
