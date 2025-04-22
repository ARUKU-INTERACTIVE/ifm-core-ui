export interface ICreateAuctionTransactionParams {
	playerId: string;
	startingPrice: number;
	auctionTimeMs: number;
}

export interface ICreateAuctionFormValues {
	startingPrice: number;
	auctionTimeInHours: number;
}
