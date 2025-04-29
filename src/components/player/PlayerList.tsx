import { IListResponse } from '@/interfaces/api/IApiBaseResponse';
import { IAuction } from '@/interfaces/auction/IAuction';
import { ICreateAuctionFormValues } from '@/interfaces/auction/ICreateAuctionTransaction';
import { IPlayer } from '@/interfaces/player/IPlayer';
import PlayerCard from '@/pages/transfer-market/components/PlayerCard';

interface IPlayerListProps {
	players: IListResponse<IPlayer>;

	submitCreateAuctionTransaction: (
		values: ICreateAuctionFormValues,
		playerId: string,
	) => Promise<void>;
	auctions: IListResponse<IAuction> | undefined;
	isSubmittingCreateAuctionTransaction: boolean;
	onMintPlayer: (playerId: string) => Promise<void>;
}

const PlayerList = ({
	players,
	submitCreateAuctionTransaction,
	auctions,
	isSubmittingCreateAuctionTransaction,
	onMintPlayer,
}: IPlayerListProps) => {
	return (
		<div className="flex flex-wrap justify-evenly gap-4 py-3 px-10">
			{players?.data.map(({ attributes, id }) => {
				const player: IPlayer = {
					...attributes,
					id: id as string,
				};
				return (
					<div key={id}>
						<PlayerCard
							player={player}
							submitCreateAuctionTransaction={submitCreateAuctionTransaction}
							auctions={auctions}
							isSubmittingCreateAuctionTransaction={
								isSubmittingCreateAuctionTransaction
							}
							onMintPlayer={onMintPlayer}
						/>
					</div>
				);
			})}
		</div>
	);
};

export default PlayerList;
