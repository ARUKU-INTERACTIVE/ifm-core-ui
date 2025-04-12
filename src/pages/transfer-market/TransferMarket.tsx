import { useState } from 'react';

import { useAuctions } from './hooks/useAuctions';
import { useCreateAuctionTransaction } from './hooks/useCreateAuctionTransaction';
import useMintPlayerSac from './hooks/useMintPlayerSac';
import { usePlayers } from './hooks/usePlayers';
import { useSubmitCreateAuctionTransaction } from './hooks/useSubmitCreateAuctionTransaction';
import useSubmitMintPlayerSac from './hooks/useSubmitMintPlayerSac';

import PlayerList from '@/components/player/PlayerList';
import Loading from '@/components/ui/Loading';
import { useWallet } from '@/hooks/auth/useWallet';
import { IListResponse } from '@/interfaces/api/IApiBaseResponse';
import { IPlayer } from '@/interfaces/player/IPlayer';

export default function TransferMarket() {
	const [name, setName] = useState('');
	const { data: players, isLoading } = usePlayers({
		name,
		isInAuction: false,
	});
	const {
		mutateAsync: createAuctionTransaction,
		data: createAuctionTransactionXDR,
	} = useCreateAuctionTransaction();
	const {
		mutateAsync: submitCreateAuctionTransaction,
		isPending: isSubmittingCreateAuctionTransaction,
	} = useSubmitCreateAuctionTransaction();
	const { handleSignTransactionXDR } = useWallet();

	const { mutateAsync: mintPlayerSac } = useMintPlayerSac();
	const { mutateAsync: submitMintPlayerSac } = useSubmitMintPlayerSac();
	const { data: auctions } = useAuctions();

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

	return (
		<>
			<h1
				className="text-xl font-bold text-center pt-3"
				data-test="transfer-market-title"
			>
				Transfer Market
			</h1>
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
