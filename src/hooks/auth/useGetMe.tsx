import { useQuery } from '@tanstack/react-query';

import { userService } from '@/services/user.service';

export const useGetMe = () => {
	return useQuery({
		queryKey: ['me'],
		queryFn: () => userService.getMe(),
	});
};
