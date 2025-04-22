import { SECONDS_PER_HOUR } from '@/constants/seconds-per-hour';

export const convertTimeToSeconds = (timeInHours: number) => {
	return timeInHours * SECONDS_PER_HOUR;
};
