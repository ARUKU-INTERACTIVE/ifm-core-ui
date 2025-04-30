import { useQuery } from '@tanstack/react-query';

import { IAuctionFilters } from '@/interfaces/auction/IAuction';
import { IGetAllConfig } from '@/interfaces/common/IGetAllConfig';
import { auctionService } from '@/services/auction.service';

export const useAuctions = (params: IGetAllConfig<IAuctionFilters>) => {
	return useQuery({
		queryKey: ['auctions', params],
		queryFn: () => auctionService.getAll(params),
	});
};
