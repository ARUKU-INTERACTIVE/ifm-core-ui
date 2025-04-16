export const convertStroopsToXlm = (stroops: number): number => {
	const STROOPS_DIVIDER = 1e7;

	return stroops / STROOPS_DIVIDER;
};
