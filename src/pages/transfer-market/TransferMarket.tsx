import { useState } from 'react';

import { useAuctions } from './hooks/useAuctions';
import { useCreateAuctionTransaction } from './hooks/useCreateAuctionTransaction';
import useGetPlayerSacTransaction from './hooks/useGetPlayerSacTransaction';
import { usePlayers } from './hooks/usePlayers';
import { useSubmitCreateAuctionTransaction } from './hooks/useSubmitCreateAuctionTransaction';
import { useSubmitMintPlayer } from './hooks/useSubmitMintPlayer';
import useSubmitMintPlayerSac from './hooks/useSubmitMintPlayerSac';

import MintPlayerModal from '@/components/player/MintPlayerModal';
import PlayerList from '@/components/player/PlayerList';
import { PLAYER_REQUIRED_ERROR } from '@/components/player/player-messages';
import Loading from '@/components/ui/Loading';
import { useWallet } from '@/hooks/auth/useWallet';
import { IListResponse } from '@/interfaces/api/IApiBaseResponse';
import { ICreateAuctionFormValues } from '@/interfaces/auction/ICreateAuctionTransaction';
import { CREATE_AUCTION_TRANSACTION_ERROR_MESSAGE } from '@/interfaces/auction/auction-messages';
import { IMintPlayerFormValues } from '@/interfaces/player/IMintPlayer';
import { IPlayer } from '@/interfaces/player/IPlayer';
import { notificationService } from '@/services/notification.service';
import { playerService } from '@/services/player.service';
import { convertPriceToStroops } from '@/utils/convertPriceToStroops';
import { convertTimeToSeconds } from '@/utils/convertTimeToSeconds';

export default function TransferMarket() {
	const { mutate: submitMintPlayer, isPending: isSubmitMintPlayerPending } =
		useSubmitMintPlayer({ onSuccess: () => handleCloseMintPlayerModal() });
	const { handleSignTransactionXDR } = useWallet();
	const [name, setName] = useState('');
	const { data: players, isLoading } = usePlayers({
		name,
		isInAuction: false,
	});
	const { mutateAsync: getPlayerSacTransaction } = useGetPlayerSacTransaction();
	const { mutateAsync: submitMintPlayerSac } = useSubmitMintPlayerSac();
	const { data: auctions } = useAuctions();
	const [isMintPlayerModalOpen, setIsMintPlayerModalOpen] = useState(false);

	const { mutateAsync: createAuctionTransaction } =
		useCreateAuctionTransaction();
	const { mutateAsync: submitCreateAuctionTransaction } =
		useSubmitCreateAuctionTransaction();

	const [isMintPlayerPending, setIsMintPlayerPending] = useState(false);
	const [isCreateAuctionPending, setIsCreateAuctionPending] = useState(false);

	const handleDeployPlayerSac = async (playerId: string) => {
		const mintResponse = await getPlayerSacTransaction(playerId);
		if (mintResponse?.data?.attributes?.xdr) {
			const signedXDR = await handleSignTransactionXDR(
				mintResponse.data.attributes.xdr,
			);
			if (signedXDR) {
				await submitMintPlayerSac({ playerId, transactionXDR: signedXDR });
			}
		}
	};

	const handleOpenMintPlayerModal = () => {
		setIsMintPlayerModalOpen(true);
	};

	const handleCloseMintPlayerModal = () => {
		setIsMintPlayerModalOpen(false);
	};

	const handleSubmitMintPlayer = async (values: IMintPlayerFormValues) => {
		setIsMintPlayerPending(true);
		if (!values.file) {
			notificationService.error(PLAYER_REQUIRED_ERROR);
			return;
		}
		const file = values.file[0];

		const {
			data: {
				attributes: { xdr, ...mintPlayerData },
			},
		} = await playerService.mintPlayer({
			file,
			name: values.name,
			description: values.description,
		});

		const signedTransactionXdr = await handleSignTransactionXDR(xdr);

		if (signedTransactionXdr) {
			submitMintPlayer({
				xdr: signedTransactionXdr,
				metadataCid: mintPlayerData.metadataCid,
				imageCid: mintPlayerData.imageCid,
				issuer: mintPlayerData.issuer,
				name: values.name,
				description: values.description,
			});
		}
		setIsMintPlayerPending(false);
	};

	const handleSubmitAuction = async (
		values: ICreateAuctionFormValues,
		playerId: string,
	) => {
		setIsCreateAuctionPending(true);
		const { startingPrice, auctionTimeInHours } = values;

		try {
			const {
				data: {
					attributes: { xdr },
					id: auctionId,
				},
			} = await createAuctionTransaction({
				playerId,
				startingPrice: convertPriceToStroops(startingPrice),
				auctionTimeMs: convertTimeToSeconds(auctionTimeInHours),
			});
			const signedXDR = await handleSignTransactionXDR(xdr);

			if (signedXDR) {
				await submitCreateAuctionTransaction({
					externalId: Number(auctionId),
					playerId: Number(playerId),
					xdr: signedXDR,
				});
			}
		} catch {
			notificationService.error(CREATE_AUCTION_TRANSACTION_ERROR_MESSAGE);
		} finally {
			setIsCreateAuctionPending(false);
		}
	};

	return (
		<>
			<div className="flex justify-center items-center pt-3">
				<h1
					className="text-xl font-bold text-center"
					data-test="transfer-market-title"
				>
					Transfer Market
				</h1>
				<button
					className="absolute right-3 bg-green-200 py-1 px-2 rounded-md"
					onClick={handleOpenMintPlayerModal}
					data-test="transfer-market-mint-player-button"
				>
					Mint Player
				</button>
			</div>
			<div className="flex justify-center items-center">
				<input
					type="text"
					placeholder="Search..."
					value={name}
					className="w-[90%] p-2 m-3 ml-1 border border-gray-300 rounded-md"
					onChange={(e) => setName(e.target.value)}
					data-test="transfer-market-searchbar"
				/>
			</div>

			<MintPlayerModal
				isOpen={isMintPlayerModalOpen}
				onHide={handleCloseMintPlayerModal}
				mintPlayer={handleSubmitMintPlayer}
				isMintPlayerPending={isMintPlayerPending}
				isSubmitMintPlayerPending={isSubmitMintPlayerPending}
			/>

			{isLoading ? (
				<Loading />
			) : (
				<PlayerList
					players={players as IListResponse<IPlayer>}
					submitCreateAuctionTransaction={handleSubmitAuction}
					auctions={auctions}
					isSubmittingCreateAuctionTransaction={isCreateAuctionPending}
					onMintPlayer={handleDeployPlayerSac}
				/>
			)}
		</>
	);
}
