export const getAuctionTimeLeft = (endTime: number) => {
	const msTimeLeft = endTime * 1000 - Date.now();
	const msToHours = msTimeLeft / 3600000;

	return msToHours;
};
