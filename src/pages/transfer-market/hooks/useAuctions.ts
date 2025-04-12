import { useQuery } from '@tanstack/react-query';

import { auctionService } from '@/services/auction.service';

export const useAuctions = () => {
	return useQuery({
		queryKey: ['auctions'],
		queryFn: () => auctionService.getAll(),
	});
};
