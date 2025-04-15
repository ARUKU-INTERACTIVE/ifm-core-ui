export const convertPriceToStroops = (price: number) => {
	const STROOPS_MULTIPLIER = 1e7;

	return price * STROOPS_MULTIPLIER;
};
