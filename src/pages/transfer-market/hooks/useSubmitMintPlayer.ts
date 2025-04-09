import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
	PLAYER_MINTED_ERROR,
	PLAYER_MINTED_SUCCESSFULLY,
} from '@/components/player/player-messages';
import { ISubmitMintPlayerParams } from '@/interfaces/player/IMintPlayer';
import { notificationService } from '@/services/notification.service';
import { playerService } from '@/services/player.service';

export interface ISubmitMintPlayerContext {
	onHide: () => void;
}

export const useSubmitMintPlayer = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (
			params: ISubmitMintPlayerParams & ISubmitMintPlayerContext,
		) => {
			const { onHide, ...submitParams } = params;
			return await playerService.submitMintPlayer(submitParams);
		},
		onSuccess: (_, params) => {
			queryClient.invalidateQueries({ queryKey: ['players'] });
			notificationService.success(PLAYER_MINTED_SUCCESSFULLY);
			params.onHide();
		},
		onError: () => {
			notificationService.error(PLAYER_MINTED_ERROR);
		},
	});
};
