import { useState } from 'react';

import AuctionCard from './AuctionCard';

import {
	IListResponse,
	ISingleResponse,
} from '@/interfaces/api/IApiBaseResponse';
import { IUser } from '@/interfaces/api/IUser';
import { IAuction } from '@/interfaces/auction/IAuction';
import { IGetClaimTransactionParams } from '@/interfaces/auction/IGetClaimTransaction';
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
		accountAddress: string,
		tokenIssuer: string,
	) => Promise<void>;
	isSubmitPlaceBidTransactionPending: boolean;
	user: ISingleResponse<IUser> | undefined;
	handleSubmitClaim: (
		getClaimTransactionParams: IGetClaimTransactionParams,
	) => Promise<void>;
	currentTime: number;
	isStellarLoading: boolean;
	isGetClaimTransactionPending: boolean;
	isSubmitClaimTransactionPending: boolean;
}

const AuctionList = ({
	auctions,
	players,
	isGetPlaceBidTransactionPending,
	handleSubmitBid,
	isSubmitPlaceBidTransactionPending,
	user,
	handleSubmitClaim,
	currentTime,
	isStellarLoading,
	isGetClaimTransactionPending,
	isSubmitClaimTransactionPending,
}: AuctionListProps) => {
	const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);

	return (
		<div className="flex flex-wrap justify-evenly gap-10 py-3 px-10">
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
				const isAuctionEnded = currentTime >= auction.attributes.endTime;

				return (
					<AuctionCard
						key={auction.id}
						playerName={auctionPlayer?.attributes.name as string}
						playerImage={auctionPlayer?.attributes.imageUri as string}
						setIsImageLoaded={setIsImageLoaded}
						isImageLoaded={isImageLoaded}
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
						ownerAddress={auction.attributes.ownerAddress}
						isAuctionEnded={isAuctionEnded}
						handleSubmitClaim={handleSubmitClaim}
						isStellarLoading={isStellarLoading}
						playerIssuer={auctionPlayer?.attributes.issuer as string}
						isGetClaimTransactionPending={isGetClaimTransactionPending}
						isSubmitClaimTransactionPending={isSubmitClaimTransactionPending}
					/>
				);
			})}
		</div>
	);
};

export default AuctionList;
