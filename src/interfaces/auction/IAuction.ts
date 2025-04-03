import { IPlayer } from '../player/IPlayer';

export interface IAuction {
	externalId: number;
	player: IPlayer;
	status: AuctionStatus;
}

enum AuctionStatus {
	Open,
	Cancelled,
	Completed,
	NFTTransferred,
}
