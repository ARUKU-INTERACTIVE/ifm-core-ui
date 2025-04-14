import { useState } from 'react';

import { useAuctions } from './hooks/useAuctions';
import { useCreateAuctionTransaction } from './hooks/useCreateAuctionTransaction';
import { useMintPlayer } from './hooks/useMintPlayer';
import useMintPlayerSac from './hooks/useMintPlayerSac';
import { usePlayers } from './hooks/usePlayers';
import { useSubmitCreateAuctionTransaction } from './hooks/useSubmitCreateAuctionTransaction';
import { useSubmitMintPlayer } from './hooks/useSubmitMintPlayer';
import useSubmitMintPlayerSac from './hooks/useSubmitMintPlayerSac';

import MintPlayerModal from '@/components/player/MintPlayerModal';
import PlayerList from '@/components/player/PlayerList';
import Loading from '@/components/ui/Loading';
import { useWallet } from '@/hooks/auth/useWallet';
import { IListResponse } from '@/interfaces/api/IApiBaseResponse';
import { IPlayer } from '@/interfaces/player/IPlayer';

export default function TransferMarket() {
	const {
		mutate: mintPlayer,
		isPending: isMintPlayerPending,
		data: mintPlayerData,
	} = useMintPlayer();
	const { mutate: submitMintPlayer, isPending: isSubmitMintPlayerPending } =
		useSubmitMintPlayer({ onSuccess: () => handleCloseMintPlayerModal() });
	const { handleSignTransactionXDR } = useWallet();
	const [name, setName] = useState('');
	const { data: players, isLoading } = usePlayers({
		name,
		isInAuction: false,
	});
	const { mutateAsync: mintPlayerSac } = useMintPlayerSac();
	const { mutateAsync: submitMintPlayerSac } = useSubmitMintPlayerSac();
	const { data: auctions } = useAuctions();
	const [isMintPlayerModalOpen, setIsMintPlayerModalOpen] = useState(false);

	const {
		mutateAsync: createAuctionTransaction,
		data: createAuctionTransactionXDR,
	} = useCreateAuctionTransaction();
	const {
		mutateAsync: submitCreateAuctionTransaction,
		isPending: isSubmittingCreateAuctionTransaction,
	} = useSubmitCreateAuctionTransaction();

	const handleMintPlayer = async (playerId: string) => {
		const mintResponse = await mintPlayerSac(playerId);
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
				mintPlayer={mintPlayer}
				isMintPlayerPending={isMintPlayerPending}
				mintPlayerData={mintPlayerData}
				submitMintPlayer={submitMintPlayer}
				isSubmitMintPlayerPending={isSubmitMintPlayerPending}
				handleSignTransactionXDR={handleSignTransactionXDR}
			/>

			{isLoading ? (
				<Loading />
			) : (
				<PlayerList
					players={players as IListResponse<IPlayer>}
					createAuctionTransaction={createAuctionTransaction}
					submitCreateAuctionTransaction={submitCreateAuctionTransaction}
					handleSignTransactionXDR={handleSignTransactionXDR}
					createAuctionTransactionXDR={createAuctionTransactionXDR}
					auctions={auctions}
					isSubmittingCreateAuctionTransaction={
						isSubmittingCreateAuctionTransaction
					}
					onMintPlayer={handleMintPlayer}
				/>
			)}
		</>
	);
}
