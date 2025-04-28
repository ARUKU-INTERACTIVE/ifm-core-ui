import { Dispatch, SetStateAction, useState } from 'react';

import CreateBidModal from './CreateBidModal';

import Loading from '@/components/ui/Loading';
import { IGetClaimTransactionParams } from '@/interfaces/auction/IGetClaimTransaction';
import { IGetPlaceBidTransactionParams } from '@/interfaces/auction/IGetPlaceBidTransaction';

interface IAuctionCardProps {
	playerName: string;
	playerImage: string;
	isImageLoaded?: boolean;
	setIsImageLoaded: Dispatch<SetStateAction<boolean>>;
	highestBidAmount: string;
	timeLeft: number;
	isGetPlaceBidTransactionPending: boolean;
	handleSubmitBid: (
		getPlaceBidTransactionParams: IGetPlaceBidTransactionParams,
		accountAddress: string,
		tokenIssuer: string,
	) => Promise<void>;
	auctionId: string;
	isSubmitPlaceBidTransactionPending: boolean;
	publicKey: string;
	highestBidderAddress: string;
	ownerAddress: string;
	isAuctionEnded: boolean;
	handleSubmitClaim: (
		getClaimTransactionParams: IGetClaimTransactionParams,
	) => Promise<void>;
	isStellarLoading: boolean;
	playerIssuer: string;
	isGetClaimTransactionPending: boolean;
	isSubmitClaimTransactionPending: boolean;
}

const AuctionCard = ({
	playerName,
	playerImage,
	setIsImageLoaded,
	isImageLoaded,
	highestBidAmount,
	timeLeft,
	isGetPlaceBidTransactionPending,
	handleSubmitBid,
	auctionId,
	isSubmitPlaceBidTransactionPending,
	publicKey,
	highestBidderAddress,
	ownerAddress,
	isAuctionEnded,
	handleSubmitClaim,
	isStellarLoading,
	playerIssuer,
	isGetClaimTransactionPending,
	isSubmitClaimTransactionPending,
}: IAuctionCardProps) => {
	const [isCreateBidModalOpen, setIsCreateBidModalOpen] =
		useState<boolean>(false);
	const isLoading =
		isGetClaimTransactionPending || isSubmitClaimTransactionPending;
	const auctionStatus = highestBidderAddress
		? 'Claim Rewards'
		: 'Cancel Auction';

	return (
		<div
			className="w-[220px] rounded-xl border-[1px] border-gray-300 overflow-hidden shadow-lg p-2 pb-0"
			data-test="auction-card"
		>
			<div>
				<div className="w-full h-48 bg-gray-200 relative z-0 mb-2">
					{playerImage && !isImageLoaded && (
						<div className="w-full max-h-48 h-full absolute inset-0 animate-pulse bg-gray-400 rounded-lg" />
					)}
					{playerImage ? (
						<img
							src={playerImage}
							alt="NFT Player"
							loading="lazy"
							onLoad={() => {
								setIsImageLoaded(true);
							}}
							className={`w-full max-h-48 h-full object-cover rounded-lg transition-opacity duration-300 ${
								isImageLoaded ? 'opacity-100' : 'opacity-0'
							}`}
						/>
					) : (
						<div className="w-full h-full bg-gray-600 flex justify-center rounded-lg items-center z-0">
							<p className="text-white text-center">No image</p>
						</div>
					)}
				</div>
				<div className="text-center">
					<div className="font-bold text-md mb-4">{playerName}</div>
				</div>
				<div>
					<p className="text-gray-700 text-base">
						<span className="font-bold">
							Highest bid: {highestBidAmount}XLM{' '}
						</span>{' '}
						<br />
						<span className="font-bold text-red-600">
							{isAuctionEnded
								? 'The auction has ended'
								: `Auction time left: ${timeLeft} hours`}
						</span>
					</p>
				</div>

				{highestBidderAddress === publicKey && (
					<p
						className="text-gray-700 text-base mt-2"
						data-test="highest-bidder-msg"
					>
						<span className="font-bold text-green-600">
							{' '}
							Congratulations! You are the highest bidder{' '}
						</span>
					</p>
				)}
			</div>

			<div className="flex justify-center items-center w-full">
				{(publicKey === ownerAddress || publicKey === highestBidderAddress) &&
				isAuctionEnded ? (
					<button
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-3 w-full"
						onClick={() => handleSubmitClaim({ auctionId: Number(auctionId) })}
					>
						{isLoading ? (
							<div className="flex justify-center items-center h-[30px]">
								<Loading />
							</div>
						) : (
							auctionStatus
						)}
					</button>
				) : (
					publicKey !== highestBidderAddress && (
						<button
							className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded m-3 w-full"
							onClick={() => setIsCreateBidModalOpen(true)}
						>
							Create a Bid
						</button>
					)
				)}
			</div>

			<CreateBidModal
				isOpen={isCreateBidModalOpen}
				onHide={() => setIsCreateBidModalOpen(false)}
				isGetPlaceBidTransactionPending={isGetPlaceBidTransactionPending}
				handleSubmitBid={handleSubmitBid}
				auctionId={auctionId}
				isSubmitPlaceBidTransactionPending={isSubmitPlaceBidTransactionPending}
				isStellarLoading={isStellarLoading}
				publicKey={publicKey}
				playerIssuer={playerIssuer}
			/>
		</div>
	);
};

export default AuctionCard;
