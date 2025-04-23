import { SECONDS_PER_HOUR } from '@/constants/seconds-per-hour';

export const getAuctionTimeLeft = (startTime: number, endTime: number) => {
	const msTimeLeft = endTime - startTime;
	const msToHours = msTimeLeft / SECONDS_PER_HOUR;

	return msToHours;
};
