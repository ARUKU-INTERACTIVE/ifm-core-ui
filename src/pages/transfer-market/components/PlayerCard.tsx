import { useEffect, useState } from 'react';
import { Tooltip } from 'react-tooltip';

import CreateAuctionModal from './CreateAuctionModal';
import { RosterOperationButton } from './RosterOperationButton';

import { DescriptionIcon } from '@/components/icon/DescriptionIcon';
import { SUBMIT_MINT_PLAYER_SAC_ERROR_MESSAGE } from '@/components/player/player-messages';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import Loading from '@/components/ui/Loading';
import { IListResponse } from '@/interfaces/api/IApiBaseResponse';
import { IAuction } from '@/interfaces/auction/IAuction';
import { ICreateAuctionFormValues } from '@/interfaces/auction/ICreateAuctionTransaction';
import { IPlayer } from '@/interfaces/player/IPlayer';
import { notificationService } from '@/services/notification.service';
import { formatHoursToHumanReadable } from '@/utils/formatHoursToHumanReadable';
import { getAuctionTimeLeft } from '@/utils/getAuctionTimeLeft';

interface IPlayerCardProps {
	readonly player: IPlayer;
	readonly submitCreateAuctionTransaction?: (
		values: ICreateAuctionFormValues,
		playerId: string,
	) => Promise<void>;
	readonly auctions?: IListResponse<IAuction>;
	readonly isSubmittingCreateAuctionTransaction?: boolean;
	readonly onMintPlayer?: (playerId: string) => Promise<void>;
	readonly isInTeam?: boolean;
	readonly addPlayerToRoster?: (playerId: string) => Promise<void>;
	readonly removePlayerFromRoster?: (playerId: string) => Promise<void>;
	readonly isLoadingOperation?: boolean;
}

export default function PlayerCard({
	player: { id, uuid, name, address, imageUri, description, rosterId },
	submitCreateAuctionTransaction,
	auctions,
	isSubmittingCreateAuctionTransaction,
	onMintPlayer,
	isInTeam,
	addPlayerToRoster,
	removePlayerFromRoster,
	isLoadingOperation = false,
}: IPlayerCardProps) {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isOpenCreateAuctionModal, setIsOpenCreateAuctionModal] =
		useState<boolean>(false);
	const [auctionTimeLeft, setAuctionTimeLeft] = useState<number>(0);
	const auctionFound = auctions?.data.find(
		(auction) => auction.attributes.playerAddress === address,
	);
	const getTimeLeft = (auction: IAuction) => {
		const endTime = auction.endTime;
		const timeLeft = getAuctionTimeLeft(endTime);

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
			await onMintPlayer?.(id);
		} catch {
			notificationService.error(SUBMIT_MINT_PLAYER_SAC_ERROR_MESSAGE);
		} finally {
			setIsLoading(false);
		}
	};
	const handleSubmitCreateAuction = async (
		values: ICreateAuctionFormValues,
		playerId: string,
	) => {
		await submitCreateAuctionTransaction?.(values, playerId);
		setIsOpenCreateAuctionModal(false);
	};

	const renderButton = () => {
		if (!address) {
			return (
				<button
					className={`bg-blue-500 text-white p-2 my-3 rounded-full w-full h-10 ${
						isLoading ? 'opacity-50' : ''
					}`}
					onClick={handleSubmitAddSac}
					data-test="enable-auction-btn"
					disabled={isLoading}
				>
					<div className="flex justify-center items-center h-full">
						{isLoading ? <Loading /> : 'Enable for Auction'}
					</div>
				</button>
			);
		}

		return (
			<button
				className="bg-blue-500 text-white p-2 my-3 rounded-full w-full h-10"
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
			className="w-[200px] rounded-xl border-[1px] border-gray-300 overflow-hidden shadow-lg p-2 pb-0 bg-white"
			data-test="card"
		>
			<ImageWithFallback
				src={imageUri}
				alt="NFT Player"
				className="w-full max-h-48 h-full object-cover rounded-lg"
				wrapperClassName="w-full h-48 bg-gray-200 relative z-0"
				fallbackClassName="w-full h-full bg-gray-600 flex justify-center rounded-lg items-center z-0"
			/>

			<div className="flex items-center gap-3 py-2">
				<Tooltip
					id={`${id}-player-description`}
					className="max-w-xs sm:max-w-lg break-words z-10"
					content={description}
					place="bottom-end"
				/>
				<p className="w-fit font-bold text-md capitalize">{name}</p>
				<div
					className="flex h-4 justify-end"
					data-tooltip-id={`${id}-player-description`}
				>
					<DescriptionIcon />
				</div>
			</div>

			{!isInTeam &&
				(auctionTimeLeft > 0 ? (
					<div
						className="pb-2 font-bold text-center"
						data-test="auction-time-left"
					>
						{auctionTimeLeft <= 0 ? (
							<p className="text-red-500 text-sm">The auction has ended</p>
						) : (
							<>
								<p className="text-red-500 text-sm">Auction Time Left:</p>
								<p
									className="text-red-600 text-md"
									data-test="auction-time-left"
								>
									{auctionTimeLeft <= 0
										? 'The auction has ended'
										: formatHoursToHumanReadable(auctionTimeLeft)}
								</p>
							</>
						)}
					</div>
				) : (
					renderButton()
				))}
			{addPlayerToRoster && !rosterId && (
				<RosterOperationButton
					label="Add to Roster"
					onClick={() => addPlayerToRoster(uuid)}
					isLoading={isLoadingOperation}
					disabled={isLoadingOperation}
					type="add"
				/>
			)}

			{removePlayerFromRoster && rosterId && (
				<RosterOperationButton
					label="Remove from Roster"
					onClick={() => removePlayerFromRoster(uuid)}
					isLoading={isLoadingOperation}
					disabled={isLoadingOperation}
					type="remove"
				/>
			)}
			<CreateAuctionModal
				playerId={id}
				submitCreateAuctionTransaction={handleSubmitCreateAuction}
				isOpen={isOpenCreateAuctionModal}
				onHide={() => setIsOpenCreateAuctionModal(false)}
				isSubmittingCreateAuctionTransaction={
					isSubmittingCreateAuctionTransaction as boolean
				}
			/>
		</div>
	);
}
