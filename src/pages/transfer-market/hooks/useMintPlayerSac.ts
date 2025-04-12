import { useMutation } from '@tanstack/react-query';

import { playerService } from '@/services/player.service';

const useMintPlayerSac = () => {
	return useMutation({
		mutationFn: (playerId: string) => playerService.mintPlayerSac(playerId),
	});
};

export default useMintPlayerSac;
