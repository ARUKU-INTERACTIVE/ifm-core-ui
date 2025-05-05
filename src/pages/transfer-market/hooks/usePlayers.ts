import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';

import { ITEMS_PER_PLAYERS_PAGE } from '@/pages/team/constants/team.constant';
import { playerService } from '@/services/player.service';

interface IUsePlayersProps {
	name?: string;
	isInAuction?: boolean;
	page?: number;
}

export const usePlayers = ({
	name,
	isInAuction,
	page,
}: IUsePlayersProps = {}) => {
	const [nameDebounce] = useDebounce(name, 300);
	const { data, isLoading } = useQuery({
		queryKey: ['players', nameDebounce, isInAuction, page],
		queryFn: () =>
			playerService.getAll({
				filters: {
					name: nameDebounce,
					isInAuction,
				},
				page: page
					? {
							number: page,
							size: ITEMS_PER_PLAYERS_PAGE,
					  }
					: undefined,
			}),
	});

	return { data, isLoading };
};
