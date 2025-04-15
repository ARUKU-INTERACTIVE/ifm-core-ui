export const getAuctionTimeLeft = (startTime: number, endTime: number) => {
	const msTimeLeft = endTime - startTime;
	const msToHours = msTimeLeft / 3600000;

	return msToHours;
};
