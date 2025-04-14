import * as yup from 'yup';

import {
	AUCTION_TIME_MIN,
	AUCTION_TIME_REQUIRED,
	STARTING_PRICE_MIN,
	STARTING_PRICE_REQUIRED,
} from './auction-schema-errors';

export const auctionPlayerSchema = yup.object({
	startingPrice: yup
		.number()
		.required(STARTING_PRICE_REQUIRED)
		.min(1, STARTING_PRICE_MIN),
	auctionTimeInHours: yup
		.number()
		.required(AUCTION_TIME_REQUIRED)
		.min(1, AUCTION_TIME_MIN),
});
