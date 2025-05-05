import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';

import { useAuctions } from '../transfer-market/hooks/useAuctions';
import { usePlayers } from '../transfer-market/hooks/usePlayers';
import AuctionList from './components/AuctionList';
import { useGetClaimTransaction } from './hooks/useGetClaimTransaction';
import { useGetPlaceBidTransaction } from './hooks/useGetPlaceBidTransaction';
import { useSubmitClaimTransaction } from './hooks/useSubmitClaimTransaction';
import { useSubmitPlaceBidTransaction } from './hooks/useSubmitPlaceBidTransaction';

import { ListWrapper } from '@/components/list-wrapper/ListWrapper';
import {
	ITEMS_PER_AUCTIONS_PAGE,
	PAGE_STEP,
} from '@/constants/auctions.constants';
import { useGetMe } from '@/hooks/auth/useGetMe';
import { useWallet } from '@/hooks/auth/useWallet';
import { SUBMIT_TRANSACTION_XDR_SUCCESS_MESSAGE } from '@/hooks/stellar/stellar-messages';
import { useStellar } from '@/hooks/stellar/useStellar';
import {
	IListResponse,
	ISingleResponse,
} from '@/interfaces/api/IApiBaseResponse';
import { ITransactionResponse } from '@/interfaces/api/ITransactionResponse';
import { AuctionStatus, IAuction } from '@/interfaces/auction/IAuction';
import { IGetClaimTransactionParams } from '@/interfaces/auction/IGetClaimTransaction';
import { IGetPlaceBidTransactionParams } from '@/interfaces/auction/IGetPlaceBidTransaction';
import {
	GET_CLAIM_TRANSACTION_ERROR_MESSAGE,
	GET_PLACE_BID_ERROR_MESSAGE,
	SUBMIT_CLAIM_TRANSACTION_ERROR_MESSAGE,
	SUBMIT_PLACE_BID_ERROR_MESSAGE,
} from '@/interfaces/auction/auction-messages';
import { notificationService } from '@/services/notification.service';
import { getCurrentTimestampInSeconds } from '@/utils/getCurrentTimestampInSeconds';

const Auctions = () => {
	const [playerName, setPlayerName] = useState<string>('');
	const [currentAuctionsPage, setCurrentAuctionsPage] = useState(0);
	const [pageCountAuctions, setPageCountAuctions] = useState(0);
	const { data: auctions, isPending: isAuctionsPending } = useAuctions({
		page: {
			number: currentAuctionsPage + PAGE_STEP,
			size: ITEMS_PER_AUCTIONS_PAGE,
		},
	});
	const { data: players } = usePlayers({
		name: playerName,
	});
	const { data: user } = useGetMe();
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
	const currentTime = getCurrentTimestampInSeconds();

	const {
		handleCreateAddTrustlineTransactionXDR,
		handleSubmitTransactionXDR,
		isLoading: isStellarLoading,
		handleCheckTrustline,
	} = useStellar();
	const {
		mutateAsync: getClaimTransaction,
		isPending: isGetClaimTransactionPending,
	} = useGetClaimTransaction();
	const {
		mutateAsync: submitClaimTransaction,
		isPending: isSubmitClaimTransactionPending,
	} = useSubmitClaimTransaction();

	useEffect(() => {
		if (auctions && players) {
			const filteredAuctionsData = auctions?.data.filter((auction) => {
				if (auction.attributes.status === AuctionStatus.NFTTransferred) {
					return false;
				}

				return players?.data.find(
					(player) =>
						player.attributes.address === auction.attributes.playerAddress,
				);
			});

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
		} catch {
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
		} catch {
			notificationService.error(SUBMIT_PLACE_BID_ERROR_MESSAGE);
		}
	};

	const handleAddTrustline = async (
		accountAddress: string,
		tokenIssuer: string,
	) => {
		const transactionXDR = await handleCreateAddTrustlineTransactionXDR(
			accountAddress,
			tokenIssuer,
		);

		if (transactionXDR) {
			const signedXDR = await handleSignTransactionXDR(transactionXDR);

			if (signedXDR) {
				await handleSubmitTransactionXDR(signedXDR);
			}

			notificationService.success(SUBMIT_TRANSACTION_XDR_SUCCESS_MESSAGE);
		}
	};

	const checkTrustline = async (
		accountAddress: string,
		tokenIssuer: string,
	): Promise<boolean> => {
		return await handleCheckTrustline(accountAddress, tokenIssuer);
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

	const handleGetClaimTransaction = async (
		auctionId: number,
	): Promise<ISingleResponse<ITransactionResponse> | undefined> => {
		try {
			const transactionXDR = await getClaimTransaction({ auctionId });

			return transactionXDR;
		} catch {
			notificationService.error(GET_CLAIM_TRANSACTION_ERROR_MESSAGE);
		}
	};

	const handleSubmitClaimTransaction = async (
		signedXDR: string,
		auctionId: number,
	) => {
		try {
			await submitClaimTransaction({
				xdr: signedXDR,
				auctionId,
			});
		} catch {
			notificationService.error(SUBMIT_CLAIM_TRANSACTION_ERROR_MESSAGE);
		}
	};

	const handleSubmitClaim = async (
		getClaimTransactionParams: IGetClaimTransactionParams,
	) => {
		const { auctionId } = getClaimTransactionParams;

		const transactionXDR = await handleGetClaimTransaction(auctionId);

		if (transactionXDR?.data.attributes.xdr) {
			const signedXDR = await handleSignTransactionXDR(
				transactionXDR.data.attributes.xdr,
			);

			if (signedXDR) {
				await handleSubmitClaimTransaction(signedXDR, auctionId);
			}
		}
	};

	const handlePageChange = ({ selected }: { selected: number }) => {
		setCurrentAuctionsPage(selected);
	};

	useEffect(() => {
		if (auctions?.meta?.pageCount) {
			setPageCountAuctions(auctions.meta.pageCount);
		}
	}, [auctions]);

	const renderAuctions = () => {
		return (
			<AuctionList
				auctions={filteredAuctions}
				players={players}
				isGetPlaceBidTransactionPending={isGetPlaceBidTransactionPending}
				handleSubmitBid={handleSubmitBid}
				isSubmitPlaceBidTransactionPending={isSubmitPlaceBidTransactionPending}
				user={user}
				handleSubmitClaim={handleSubmitClaim}
				currentTime={currentTime}
				isStellarLoading={isStellarLoading}
				isGetClaimTransactionPending={isGetClaimTransactionPending}
				isSubmitClaimTransactionPending={isSubmitClaimTransactionPending}
				handleAddTrustline={handleAddTrustline}
				checkTrustline={checkTrustline}
			/>
		);
	};
	return (
		<div className="flex flex-col justify-center items-center pt-3 w-full text-center">
			<h1 className="text-xl font-bold text-center" data-test="auctions-title">
				Auctions
			</h1>

			<div className="flex justify-center items-center w-full">
				<input
					type="text"
					placeholder="Search..."
					value={playerName}
					className="w-[90%] p-2 m-3 ml-1 border border-gray-300 rounded-md"
					onChange={(e) => setPlayerName(e.target.value)}
					data-test="auctions-searchbar"
				/>
			</div>

			<ListWrapper
				shouldShowList={Boolean(filteredAuctions?.data.length)}
				emptyText="No auctions found"
				listComponent={renderAuctions}
				isLoading={isAuctionsPending}
			/>
			<ReactPaginate
				pageCount={pageCountAuctions}
				pageRangeDisplayed={2}
				marginPagesDisplayed={1}
				onPageChange={handlePageChange}
				containerClassName="flex justify-center mt-6 gap-2"
				pageClassName="px-2.5 rounded-full border cursor-pointer"
				activeClassName="bg-blue-500 rounded-full text-white"
				previousLabel="<"
				nextLabel=">"
				breakLabel="..."
				disabledClassName="opacity-50 cursor-not-allowed"
				data-test="auctions-pagination"
			/>
		</div>
	);
};

export default Auctions;
