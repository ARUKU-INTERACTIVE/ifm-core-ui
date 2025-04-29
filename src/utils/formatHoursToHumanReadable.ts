export function formatHoursToHumanReadable(hours: number): string {
	const wholeHours = Math.floor(hours);
	const minutes = Math.round((hours - wholeHours) * 60);

	if (wholeHours > 0 && minutes > 0) {
		return `${wholeHours}h ${minutes}min`;
	} else if (wholeHours > 0) {
		return `${wholeHours}h`;
	} else {
		return `${minutes}min`;
	}
}
