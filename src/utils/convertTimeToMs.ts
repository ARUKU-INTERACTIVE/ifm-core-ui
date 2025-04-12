export const convertTimeToMs = (timeInHours: number) => {
	const MILISECONDS_PER_HOUR = 3600000;

	return timeInHours * MILISECONDS_PER_HOUR;
};
