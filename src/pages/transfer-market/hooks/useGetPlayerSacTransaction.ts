import { useMutation } from '@tanstack/react-query';

import { playerService } from '@/services/player.service';

const useGetPlayerSacTransaction = () => {
	return useMutation({
		mutationFn: (playerId: string) =>
			playerService.getPlayerSACTransaction(playerId),
	});
};

export default useGetPlayerSacTransaction;
