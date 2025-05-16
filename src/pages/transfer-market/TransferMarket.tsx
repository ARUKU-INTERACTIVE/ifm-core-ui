import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';

import { useAuctions } from './hooks/useAuctions';
import { useCreateAuctionTransaction } from './hooks/useCreateAuctionTransaction';
import useGetPlayerSacTransaction from './hooks/useGetPlayerSacTransaction';
import { usePlayers } from './hooks/usePlayers';
import { useSubmitCreateAuctionTransaction } from './hooks/useSubmitCreateAuctionTransaction';
import { useSubmitMintPlayer } from './hooks/useSubmitMintPlayer';
import useSubmitMintPlayerSac from './hooks/useSubmitMintPlayerSac';

import { ListWrapper } from '@/components/list-wrapper/ListWrapper';
import MintPlayerModal from '@/components/player/MintPlayerModal';
import PlayerList from '@/components/player/PlayerList';
import {
	PLAYER_MINTED_ERROR,
	PLAYER_REQUIRED_ERROR,
} from '@/components/player/player-messages';
import { PAGE_STEP } from '@/constants/auctions.constants';
import { useWallet } from '@/hooks/auth/useWallet';
import { IListResponse } from '@/interfaces/api/IApiBaseResponse';
import { ICreateAuctionFormValues } from '@/interfaces/auction/ICreateAuctionTransaction';
import {
	CREATE_AUCTION_TRANSACTION_ERROR_MESSAGE,
	PLAYER_NOT_OWNED_ERROR,
} from '@/interfaces/auction/auction-messages';
import { IMintPlayerFormValues } from '@/interfaces/player/IMintPlayer';
import { IPlayer } from '@/interfaces/player/IPlayer';
import { notificationService } from '@/services/notification.service';
import { playerService } from '@/services/player.service';
import { convertTimeToSeconds } from '@/utils/convertTimeToSeconds';

export default function TransferMarket() {
	const { mutate: submitMintPlayer, isPending: isSubmitMintPlayerPending } =
		useSubmitMintPlayer({ onSuccess: () => handleCloseMintPlayerModal() });
	const { handleSignTransactionXDR } = useWallet();
	const [name, setName] = useState('');
	const [currentPlayersPage, setCurrentPlayersPage] = useState(0);
	const [pageCountPlayers, setPageCountPlayers] = useState(0);
	const { data: players, isLoading } = usePlayers({
		name,
		isInAuction: false,
		page: currentPlayersPage + PAGE_STEP,
	});
	const { mutateAsync: getPlayerSacTransaction } = useGetPlayerSacTransaction();
	const { mutateAsync: submitMintPlayerSac } = useSubmitMintPlayerSac();
	const { data: auctions } = useAuctions({});
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
		try {
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
			setCurrentPlayersPage(0);
		} catch (error) {
			console.log(error);
			notificationService.error(PLAYER_MINTED_ERROR);
		} finally {
			setIsMintPlayerPending(false);
		}
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
				startingPrice,
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
		} catch (error) {
			if (
				error instanceof Error &&
				error.message === 'Player not owned by user'
			) {
				return notificationService.error(PLAYER_NOT_OWNED_ERROR);
			}

			notificationService.error(CREATE_AUCTION_TRANSACTION_ERROR_MESSAGE);
		} finally {
			setIsCreateAuctionPending(false);
		}
	};

	const handlePageChange = ({ selected }: { selected: number }) => {
		setCurrentPlayersPage(selected);
	};

	useEffect(() => {
		if (players?.meta?.pageCount) {
			setPageCountPlayers(players.meta.pageCount);
		}
	}, [players]);

	const renderPlayers = () => {
		return (
			<PlayerList
				players={players as IListResponse<IPlayer>}
				submitCreateAuctionTransaction={handleSubmitAuction}
				auctions={auctions}
				isSubmittingCreateAuctionTransaction={isCreateAuctionPending}
				onMintPlayer={handleDeployPlayerSac}
			/>
		);
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

			<ListWrapper
				shouldShowList={Boolean(players?.data.length)}
				emptyText="No players found"
				listComponent={renderPlayers}
				isLoading={isLoading}
			/>
			<ReactPaginate
				pageCount={pageCountPlayers}
				pageRangeDisplayed={2}
				marginPagesDisplayed={1}
				onPageChange={handlePageChange}
				forcePage={currentPlayersPage}
				containerClassName="flex justify-center mt-6 gap-2"
				pageClassName="px-2.5 rounded-full border cursor-pointer"
				activeClassName="bg-blue-500 rounded-full text-white"
				previousLabel="<"
				nextLabel=">"
				breakLabel="..."
				disabledClassName="opacity-50 cursor-not-allowed"
				data-test="transfer-market-pagination"
			/>
		</>
	);
}
