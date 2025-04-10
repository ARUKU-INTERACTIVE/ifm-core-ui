import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
	PLAYER_MINTED_ERROR,
	PLAYER_MINTED_SUCCESSFULLY,
} from '@/components/player/player-messages';
import { ISubmitMintPlayerParams } from '@/interfaces/player/IMintPlayer';
import { notificationService } from '@/services/notification.service';
import { playerService } from '@/services/player.service';

export interface ISubmitMintPlayerSuccess {
	onSuccess: () => void;
}

export const useSubmitMintPlayer = ({
	onSuccess,
}: ISubmitMintPlayerSuccess) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (params: ISubmitMintPlayerParams) => {
			return await playerService.submitMintPlayer(params);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['players'] });
			notificationService.success(PLAYER_MINTED_SUCCESSFULLY);
			onSuccess();
		},
		onError: () => {
			notificationService.error(PLAYER_MINTED_ERROR);
		},
	});
};
