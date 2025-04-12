import { useMutation, useQueryClient } from '@tanstack/react-query';

import { SUBMIT_MINT_PLAYER_SAC_SUCCESS_MESSAGE } from '@/components/player/player-messages';
import { notificationService } from '@/services/notification.service';
import { playerService } from '@/services/player.service';

const useSubmitMintPlayerSac = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			playerId,
			transactionXDR,
		}: {
			playerId: string;
			transactionXDR: string;
		}) => playerService.submitPlayerSac(playerId, transactionXDR),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['players'],
			});
			notificationService.success(SUBMIT_MINT_PLAYER_SAC_SUCCESS_MESSAGE);
		},
	});
};

export default useSubmitMintPlayerSac;
