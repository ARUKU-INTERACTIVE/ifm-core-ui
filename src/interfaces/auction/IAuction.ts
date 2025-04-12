import { IPlayer } from '../player/IPlayer';

export interface IAuction {
	id: number;
	uuid: string;
	externalId: number;
	highestBidAmount: number;
	endTime: number;
	startTime: number;
	player: IPlayer;
	status: AuctionStatus;
	highestBidderAddress: string;
	playerAddress: string;
	createdAt: string;
	updatedAt: string;
	deletedAt?: string;
}

enum AuctionStatus {
	Open,
	Cancelled,
	Completed,
	NFTTransferred,
}
