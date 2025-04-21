export const convertTimeToSeconds = (timeInHours: number) => {
	const SECONDS_PER_HOUR = 3600;

	return timeInHours * SECONDS_PER_HOUR;
};
