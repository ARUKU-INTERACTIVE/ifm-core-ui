import { UseMutateFunction } from '@tanstack/react-query';

import MintPlayerForm from './MintPlayerForm';

import { ISingleResponse } from '@/interfaces/api/IApiBaseResponse';
import {
	IMintPlayerParams,
	ISubmitMintPlayerParams,
} from '@/interfaces/player/IMintPlayer';
import { IPlayer } from '@/interfaces/player/IPlayer';
import { ITransactionNFTData } from '@/interfaces/player/ITransactionNFT';
import { ISubmitMintPlayerContext } from '@/pages/transfer-market/hooks/useSubmitMintPlayer';

interface IMintPlayerModalProps {
	isOpen: boolean;
	onHide: () => void;
	mintPlayer: UseMutateFunction<
		ISingleResponse<ITransactionNFTData>,
		Error,
		IMintPlayerParams,
		unknown
	>;
	isMintPlayerPending: boolean;
	mintPlayerData: ISingleResponse<ITransactionNFTData> | undefined;
	submitMintPlayer: UseMutateFunction<
		ISingleResponse<IPlayer>,
		Error,
		ISubmitMintPlayerParams & ISubmitMintPlayerContext,
		unknown
	>;
	isSubmitMintPlayerPending: boolean;
	handleSignTransactionXDR: (xdr: string) => Promise<string | undefined>;
}

const MintPlayerModal = ({
	isOpen,
	onHide,
	mintPlayer,
	isMintPlayerPending,
	mintPlayerData,
	submitMintPlayer,
	isSubmitMintPlayerPending,
	handleSignTransactionXDR,
}: IMintPlayerModalProps) => {
	if (!isOpen) {
		return null;
	}

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
			<div className="bg-white p-6 rounded-md w-[80%] max-w-md">
				<h2
					className="text-2xl font-bold text-center mb-4"
					data-test="mint-player-modal-title"
				>
					Mint Player
				</h2>
				<MintPlayerForm
					onHide={onHide}
					mintPlayer={mintPlayer}
					isMintPlayerPending={isMintPlayerPending}
					mintPlayerData={mintPlayerData}
					submitMintPlayer={submitMintPlayer}
					isSubmitMintPlayerPending={isSubmitMintPlayerPending}
					handleSignTransactionXDR={handleSignTransactionXDR}
				/>
			</div>
		</div>
	);
};

export default MintPlayerModal;
