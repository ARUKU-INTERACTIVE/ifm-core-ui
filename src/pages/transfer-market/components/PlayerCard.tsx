import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import CreateAuctionModal from './CreateAuctionModal';

import { SUBMIT_MINT_PLAYER_SAC_ERROR_MESSAGE } from '@/components/player/player-messages';
import Loading from '@/components/ui/Loading';
import {
	IListResponse,
	ISingleResponse,
} from '@/interfaces/api/IApiBaseResponse';
import { ITransactionResponse } from '@/interfaces/api/ITransactionResponse';
import { IAuction } from '@/interfaces/auction/IAuction';
import { ICreateAuctionTransactionParams } from '@/interfaces/auction/ICreateAuctionTransaction';
import { ISubmitCreateAuctionTransactionParams } from '@/interfaces/auction/ISubmitCreateAuction';
import { notificationService } from '@/services/notification.service';
import { getAuctionTimeLeft } from '@/utils/getAuctionTimeLeft';

interface IPlayerCardProps {
	readonly name: string;
	readonly playerId: string;
	readonly playerAddress: string;
	readonly createAuctionTransaction: UseMutateAsyncFunction<
		ISingleResponse<ITransactionResponse>,
		Error,
		ICreateAuctionTransactionParams,
		unknown
	>;
	readonly submitCreateAuctionTransaction: UseMutateAsyncFunction<
		ISingleResponse<IAuction>,
		Error,
		ISubmitCreateAuctionTransactionParams,
		unknown
	>;
	readonly handleSignTransactionXDR: (
		transactionXDR: string,
	) => Promise<string | undefined>;
	readonly createAuctionTransactionXDR:
		| ISingleResponse<ITransactionResponse>
		| undefined;
	readonly auctions: IListResponse<IAuction> | undefined;
	readonly isSubmittingCreateAuctionTransaction: boolean;
	readonly onMintPlayer: (playerId: string) => Promise<void>;
}

export default function PlayerCard({
	name,
	playerId,
	playerAddress,
	createAuctionTransaction,
	submitCreateAuctionTransaction,
	handleSignTransactionXDR,
	createAuctionTransactionXDR,
	auctions,
	isSubmittingCreateAuctionTransaction,
	onMintPlayer,
}: IPlayerCardProps) {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isOpenCreateAuctionModal, setIsOpenCreateAuctionModal] =
		useState<boolean>(false);
	const [auctionTimeLeft, setAuctionTimeLeft] = useState<number>(0);
	const auctionFound = auctions?.data.find(
		(auction) => auction.attributes.playerAddress === playerAddress,
	);
	const getTimeLeft = (auction: IAuction) => {
		const endTime = auction.endTime;
		const startTime = auction.startTime;

		const timeLeft = getAuctionTimeLeft(startTime, endTime);

		return timeLeft;
	};

	useEffect(() => {
		if (auctionFound) {
			const timeLeft = getTimeLeft(auctionFound.attributes);
			setAuctionTimeLeft(timeLeft);
		}
	}, [auctionFound]);

	useEffect(() => {
		if (auctionTimeLeft > 0) {
			setIsOpenCreateAuctionModal(false);
		}
	}, [auctionTimeLeft]);

	const handleSubmitAddSac = async () => {
		try {
			setIsLoading(true);
			await onMintPlayer(playerId);
		} catch (error) {
			notificationService.error(SUBMIT_MINT_PLAYER_SAC_ERROR_MESSAGE);
		} finally {
			setIsLoading(false);
		}
	};

	const renderButton = () => {
		if (!playerAddress) {
			return (
				<button
					className={`bg-blue-500 text-white p-2 my-3 rounded-md w-full h-10 ${
						isLoading ? 'opacity-50' : ''
					}`}
					onClick={handleSubmitAddSac}
					data-test="enable-auction-btn"
					disabled={isLoading}
				>
					<div className="flex justify-center items-center h-full">
						{isLoading ? <Loading /> : 'Enable Auction'}
					</div>
				</button>
			);
		}

		return (
			<button
				className="bg-blue-500 text-white p-2 my-3 rounded-md w-full h-10"
				onClick={() => setIsOpenCreateAuctionModal(true)}
				data-test="create-auction-btn"
			>
				<div className="flex justify-center items-center h-full">
					Create Auction
				</div>
			</button>
		);
	};

	return (
		<div
			className="max-w-sm rounded overflow-hidden shadow-lg p-2 pb-0"
			data-test="card"
		>
			<div className="px-6 py-4">
				<div className="font-bold text-md mb-2">{name}</div>
			</div>

			{auctionTimeLeft > 0 ? (
				<div
					className="text-sm text-red-500 pl-6 pb-2 font-bold"
					data-test="auction-time-left"
				>
					Auction Time Left: {auctionTimeLeft} hours
				</div>
			) : (
				renderButton()
			)}

			<CreateAuctionModal
				playerId={playerId}
				createAuctionTransaction={createAuctionTransaction}
				submitCreateAuctionTransaction={submitCreateAuctionTransaction}
				handleSignTransactionXDR={handleSignTransactionXDR}
				createAuctionTransactionXDR={createAuctionTransactionXDR}
				isOpen={isOpenCreateAuctionModal}
				onHide={() => setIsOpenCreateAuctionModal(false)}
				isSubmittingCreateAuctionTransaction={
					isSubmittingCreateAuctionTransaction
				}
			/>
		</div>
	);
}
