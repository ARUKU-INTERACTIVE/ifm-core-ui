import { useMutation } from '@tanstack/react-query';

import { IMintPlayerParams } from '@/interfaces/player/IMintPlayer';
import { playerService } from '@/services/player.service';

export const useMintPlayer = () => {
	return useMutation({
		mutationFn: async (mintPlayerParams: IMintPlayerParams) => {
			return await playerService.mintPlayer(mintPlayerParams);
		},
	});
};
