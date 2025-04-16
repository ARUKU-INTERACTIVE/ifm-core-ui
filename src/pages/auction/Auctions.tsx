import { useEffect, useState } from 'react';

import { useAuctions } from '../transfer-market/hooks/useAuctions';
import { usePlayers } from '../transfer-market/hooks/usePlayers';
import AuctionList from './components/AuctionList';
import { useGetPlaceBidTransaction } from './hooks/useGetPlaceBidTransaction';
import { useSubmitPlaceBidTransaction } from './hooks/useSubmitPlaceBidTransaction';

import Loading from '@/components/ui/Loading';
import { useGetMe } from '@/hooks/auth/useGetMe';
import { useWallet } from '@/hooks/auth/useWallet';
import {
	IListResponse,
	ISingleResponse,
} from '@/interfaces/api/IApiBaseResponse';
import { ITransactionResponse } from '@/interfaces/api/ITransactionResponse';
import { IAuction } from '@/interfaces/auction/IAuction';
import { IGetPlaceBidTransactionParams } from '@/interfaces/auction/IGetPlaceBidTransaction';
import {
	GET_PLACE_BID_ERROR_MESSAGE,
	SUBMIT_PLACE_BID_ERROR_MESSAGE,
} from '@/interfaces/auction/auction-messages';
import { notificationService } from '@/services/notification.service';

const Auctions = () => {
	const [playerName, setPlayerName] = useState<string>('');
	const { data: auctions, isPending: isAuctionsPending } = useAuctions();
	const { data: players } = usePlayers({ name: playerName });
	const { data: myUser } = useGetMe();
	const [filteredAuctions, setFilteredAuctions] = useState<
		IListResponse<IAuction> | undefined
	>(auctions);
	const { handleSignTransactionXDR } = useWallet();
	const {
		mutateAsync: getPlaceBidTransaction,
		isPending: isGetPlaceBidTransactionPending,
	} = useGetPlaceBidTransaction();
	const {
		mutateAsync: submitPlaceBidTransaction,
		isPending: isSubmitPlaceBidTransactionPending,
	} = useSubmitPlaceBidTransaction();

	useEffect(() => {
		if (auctions && players) {
			const filteredAuctionsData = auctions?.data.filter((auction) =>
				players?.data.find(
					(player) =>
						player.attributes.address === auction.attributes.playerAddress,
				),
			);

			setFilteredAuctions({
				...auctions,
				data: filteredAuctionsData,
				links: auctions.links,
			});
		}
	}, [players, auctions]);

	const handleGetPlaceBidTransaction = async (
		bidAmount: number,
		auctionId: number,
	): Promise<ISingleResponse<ITransactionResponse> | undefined> => {
		try {
			const transactionXDR = await getPlaceBidTransaction({
				bidAmount,
				auctionId,
			});

			return transactionXDR;
		} catch (error) {
			notificationService.error(GET_PLACE_BID_ERROR_MESSAGE);
		}
	};

	const handleSubmitPlaceBidTransaction = async (
		signedXDR: string,
		auctionId: number,
	): Promise<void> => {
		try {
			await submitPlaceBidTransaction({
				xdr: signedXDR,
				auctionId,
			});
		} catch (error) {
			notificationService.error(SUBMIT_PLACE_BID_ERROR_MESSAGE);
		}
	};

	const handleSubmitBid = async (
		getPlaceBidTransactionParams: IGetPlaceBidTransactionParams,
	) => {
		const { bidAmount, auctionId } = getPlaceBidTransactionParams;

		const transactionXDR = await handleGetPlaceBidTransaction(
			bidAmount,
			auctionId,
		);

		if (transactionXDR?.data.attributes.xdr) {
			const signedXDR = await handleSignTransactionXDR(
				transactionXDR.data.attributes.xdr,
			);

			if (signedXDR) {
				await handleSubmitPlaceBidTransaction(signedXDR, auctionId);
			}
		}
	};

	return (
		<div className="text-xl font-bold text-center p-3">
			<h1 data-test="auctions-title">Auctions</h1>

			<div className="flex justify-center items-center">
				<input
					type="text"
					placeholder="Search..."
					value={playerName}
					className="w-[90%] p-2 m-3 ml-1 border border-gray-300 rounded-md"
					onChange={(e) => setPlayerName(e.target.value)}
					data-test="auctions-searchbar"
				/>
			</div>

			{isAuctionsPending ? (
				<Loading />
			) : (
				<AuctionList
					auctions={filteredAuctions}
					players={players}
					isGetPlaceBidTransactionPending={isGetPlaceBidTransactionPending}
					handleSubmitBid={handleSubmitBid}
					isSubmitPlaceBidTransactionPending={
						isSubmitPlaceBidTransactionPending
					}
					myUser={myUser}
				/>
			)}
		</div>
	);
};

export default Auctions;
