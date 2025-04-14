import { UseMutateAsyncFunction } from '@tanstack/react-query';

import PlayerAuctionForm from './PlayerAuctionForm';

import { ISingleResponse } from '@/interfaces/api/IApiBaseResponse';
import { ITransactionResponse } from '@/interfaces/api/ITransactionResponse';
import { IAuction } from '@/interfaces/auction/IAuction';
import { ICreateAuctionTransactionParams } from '@/interfaces/auction/ICreateAuctionTransaction';
import { ISubmitCreateAuctionTransactionParams } from '@/interfaces/auction/ISubmitCreateAuction';

interface ICreateAuctionModalProps {
	playerId: string;
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
	isOpen: boolean;
	onHide: () => void;
	isSubmittingCreateAuctionTransaction: boolean;
}

const CreateAuctionModal = ({
	playerId,
	createAuctionTransaction,
	submitCreateAuctionTransaction,
	handleSignTransactionXDR,
	createAuctionTransactionXDR,
	isOpen,
	onHide,
	isSubmittingCreateAuctionTransaction,
}: ICreateAuctionModalProps) => {
	if (!isOpen) {
		return null;
	}

	return (
		<div className="z-10 w-auto p-3 bg-white rounded-lg shadow dark:bg-gray-700 fixed">
			<h6 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
				Create Auction
			</h6>
			<PlayerAuctionForm
				playerId={playerId}
				createAuctionTransaction={createAuctionTransaction}
				submitCreateAuctionTransaction={submitCreateAuctionTransaction}
				handleSignTransactionXDR={handleSignTransactionXDR}
				createAuctionTransactionXDR={createAuctionTransactionXDR}
				onHide={onHide}
				isSubmittingCreateAuctionTransaction={
					isSubmittingCreateAuctionTransaction
				}
			/>
		</div>
	);
};

export default CreateAuctionModal;
