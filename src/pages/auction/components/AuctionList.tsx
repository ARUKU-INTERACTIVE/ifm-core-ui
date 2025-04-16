import AuctionCard from './AuctionCard';

import {
	IListResponse,
	ISingleResponse,
} from '@/interfaces/api/IApiBaseResponse';
import { IUser } from '@/interfaces/api/IUser';
import { IAuction } from '@/interfaces/auction/IAuction';
import { IGetPlaceBidTransactionParams } from '@/interfaces/auction/IGetPlaceBidTransaction';
import { IPlayer } from '@/interfaces/player/IPlayer';
import { convertStroopsToXlm } from '@/utils/convert-stroops-to-xlm';
import { formatPrice } from '@/utils/format-price';
import { getAuctionTimeLeft } from '@/utils/getAuctionTimeLeft';

interface AuctionListProps {
	auctions: IListResponse<IAuction> | undefined;
	players: IListResponse<IPlayer> | undefined;
	isGetPlaceBidTransactionPending: boolean;
	handleSubmitBid: (
		getPlaceBidTransactionParams: IGetPlaceBidTransactionParams,
	) => Promise<void>;
	isSubmitPlaceBidTransactionPending: boolean;
	user: ISingleResponse<IUser> | undefined;
}

const AuctionList = ({
	auctions,
	players,
	isGetPlaceBidTransactionPending,
	handleSubmitBid,
	isSubmitPlaceBidTransactionPending,
	user,
}: AuctionListProps) => {
	return (
		<div className="grid grid-cols-3 gap-4 py-3 px-10">
			{auctions?.data.map((auction) => {
				const auctionPlayer = players?.data.find(
					(player) =>
						player.attributes.address === auction.attributes.playerAddress,
				);
				const highestBidAmountInXLM = convertStroopsToXlm(
					auction.attributes.highestBidAmount,
				);
				const auctionTimeLeft = getAuctionTimeLeft(
					auction.attributes.startTime,
					auction.attributes.endTime,
				);

				return (
					<AuctionCard
						key={auction.id}
						playerName={auctionPlayer?.attributes.name as string}
						highestBidAmount={formatPrice(highestBidAmountInXLM)}
						timeLeft={auctionTimeLeft}
						isGetPlaceBidTransactionPending={isGetPlaceBidTransactionPending}
						handleSubmitBid={handleSubmitBid}
						auctionId={auction.id as string}
						isSubmitPlaceBidTransactionPending={
							isSubmitPlaceBidTransactionPending
						}
						publicKey={user?.data.attributes.publicKey as string}
						highestBidderAddress={auction.attributes.highestBidderAddress}
					/>
				);
			})}
		</div>
	);
};

export default AuctionList;
