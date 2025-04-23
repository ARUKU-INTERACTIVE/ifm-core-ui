import PlayerAuctionForm from './PlayerAuctionForm';

import { ICreateAuctionFormValues } from '@/interfaces/auction/ICreateAuctionTransaction';

interface ICreateAuctionModalProps {
	playerId: string;

	submitCreateAuctionTransaction: (
		values: ICreateAuctionFormValues,
		playerId: string,
	) => Promise<void>;
	isOpen: boolean;
	onHide: () => void;
	isSubmittingCreateAuctionTransaction: boolean;
}

const CreateAuctionModal = ({
	playerId,
	submitCreateAuctionTransaction,
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
					submitCreateAuctionTransaction={submitCreateAuctionTransaction}
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
