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
		<div className="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
			<div className="relative z-10 w-[400px] h-auto p-6 bg-white rounded-lg shadow dark:bg-gray-700">
				<h6 className="mb-3 font-medium text-gray-900 dark:text-white">
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
		</div>
	);
};

export default CreateAuctionModal;
