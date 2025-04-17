import * as yup from 'yup';

import { BID_AMOUNT_MIN, BID_AMOUNT_REQUIRED } from './auction-schema-errors';

export const auctionBidSchema = yup.object({
	bidAmount: yup.number().required(BID_AMOUNT_REQUIRED).min(1, BID_AMOUNT_MIN),
});
