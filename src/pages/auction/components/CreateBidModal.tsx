import CreateBidForm from './CreateBidForm';

import { IGetPlaceBidTransactionParams } from '@/interfaces/auction/IGetPlaceBidTransaction';

interface ICreateBidModalProps {
	isOpen: boolean;
	onHide: () => void;
	isGetPlaceBidTransactionPending: boolean;
	handleSubmitBid(
		getPlaceBidTransactionParams: IGetPlaceBidTransactionParams,
	): Promise<void>;
	auctionId: string;
	isSubmitPlaceBidTransactionPending: boolean;
}

const CreateBidModal = ({
	isOpen,
	onHide,
	isGetPlaceBidTransactionPending,
	handleSubmitBid,
	auctionId,
	isSubmitPlaceBidTransactionPending,
}: ICreateBidModalProps) => {
	if (!isOpen) {
		return null;
	}

	return (
		<div className="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
			<div className="relative z-10 w-[400px] h-auto p-6 bg-white rounded-lg shadow dark:bg-gray-700">
				<h6 className="mb-3 font-medium text-gray-900 dark:text-white">
					Create a Bid
				</h6>

				<CreateBidForm
					onHide={onHide}
					isGetPlaceBidTransactionPending={isGetPlaceBidTransactionPending}
					handleSubmitBid={handleSubmitBid}
					auctionId={auctionId}
					isSubmitPlaceBidTransactionPending={
						isSubmitPlaceBidTransactionPending
					}
				/>
			</div>
		</div>
	);
};

export default CreateBidModal;
