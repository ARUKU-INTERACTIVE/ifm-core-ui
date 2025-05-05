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
	ownerAddress: string;
	createdAt: string;
	updatedAt: string;
	deletedAt?: string;
}

export enum AuctionStatus {
	Open = 'Open',
	Cancelled = 'Cancelled',
	Completed = 'Completed',
	NFTTransferred = 'NFTTransferred',
}

export interface IAuctionFilters {
	playerAddress?: string;
	ownerAddress?: string;
	highestBidderAddress?: string;
	status?: AuctionStatus;
}
