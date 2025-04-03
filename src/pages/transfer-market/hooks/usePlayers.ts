import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';

import { playerService } from '@/services/player.service';

export const usePlayers = (name: string, isInAuction: boolean) => {
	const [nameDebounce] = useDebounce(name, 300);

	return useQuery({
		queryKey: ['players', nameDebounce, isInAuction],
		queryFn: () => playerService.getAll(nameDebounce, isInAuction),
	});
};
