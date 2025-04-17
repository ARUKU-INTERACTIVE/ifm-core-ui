import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';

import { playerService } from '@/services/player.service';

interface IUsePlayersProps {
	name?: string;
	isInAuction?: boolean;
}

export const usePlayers = ({ name, isInAuction }: IUsePlayersProps = {}) => {
	const [nameDebounce] = useDebounce(name, 300);

	return useQuery({
		queryKey: ['players', nameDebounce, isInAuction],
		queryFn: () =>
			playerService.getAll({
				filters: {
					name: nameDebounce,
					isInAuction,
				},
			}),
	});
};
