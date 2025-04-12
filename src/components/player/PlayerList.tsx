import { UseMutateAsyncFunction } from '@tanstack/react-query';

import {
	IListResponse,
	ISingleResponse,
} from '@/interfaces/api/IApiBaseResponse';
import { ITransactionResponse } from '@/interfaces/api/ITransactionResponse';
import { IAuction } from '@/interfaces/auction/IAuction';
import { ICreateAuctionTransactionParams } from '@/interfaces/auction/ICreateAuctionTransaction';
import { ISubmitCreateAuctionTransactionParams } from '@/interfaces/auction/ISubmitCreateAuction';
import { IPlayer } from '@/interfaces/player/IPlayer';
import PlayerCard from '@/pages/transfer-market/components/PlayerCard';

type Props = {
	players: IListResponse<IPlayer>;
	createAuctionTransaction: UseMutateAsyncFunction<
		ISingleResponse<ITransactionResponse>,
		Error,
		ICreateAuctionTransactionParams,
		unknown
	>;
	submitCreateAuctionTransaction: UseMutateAsyncFunction<
		ISingleResponse<IAuction>,
		Error,
		ISubmitCreateAuctionTransactionParams,
		unknown
	>;
	handleSignTransactionXDR: (
		transactionXDR: string,
	) => Promise<string | undefined>;
	createAuctionTransactionXDR:
		| ISingleResponse<ITransactionResponse>
		| undefined;
	auctions: IListResponse<IAuction> | undefined;
	isSubmittingCreateAuctionTransaction: boolean;
	onMintPlayer: (playerId: string) => Promise<void>;
};

const PlayerList = ({
	players,
	createAuctionTransaction,
	submitCreateAuctionTransaction,
	handleSignTransactionXDR,
	createAuctionTransactionXDR,
	auctions,
	isSubmittingCreateAuctionTransaction,
	onMintPlayer,
}: Props) => {
	return (
		<div className="grid grid-cols-3 gap-4 py-3 px-10">
			{players?.data.map((player) => (
				<PlayerCard
					key={player.id}
					playerId={player.id as string}
					playerAddress={player.attributes.address as string}
					name={player.attributes.name}
					createAuctionTransaction={createAuctionTransaction}
					submitCreateAuctionTransaction={submitCreateAuctionTransaction}
					handleSignTransactionXDR={handleSignTransactionXDR}
					createAuctionTransactionXDR={createAuctionTransactionXDR}
					auctions={auctions}
					isSubmittingCreateAuctionTransaction={
						isSubmittingCreateAuctionTransaction
					}
					onMintPlayer={onMintPlayer}
				/>
			))}
		</div>
	);
};

export default PlayerList;
