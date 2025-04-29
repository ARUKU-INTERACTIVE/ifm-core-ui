import { useEffect, useState } from 'react';

import CreateBidForm from './CreateBidForm';

import Loading from '@/components/ui/Loading';
import { IGetPlaceBidTransactionParams } from '@/interfaces/auction/IGetPlaceBidTransaction';

interface ICreateBidModalProps {
	isOpen: boolean;
	onHide: () => void;
	isGetPlaceBidTransactionPending: boolean;
	handleSubmitBid: (
		getPlaceBidTransactionParams: IGetPlaceBidTransactionParams,
		accountAddress: string,
		tokenIssuer: string,
	) => Promise<void>;
	auctionId: string;
	isSubmitPlaceBidTransactionPending: boolean;
	isStellarLoading: boolean;
	publicKey: string;
	playerIssuer: string;
	checkTrustline: (
		accountAddress: string,
		tokenIssuer: string,
	) => Promise<boolean>;
	handleAddTrustline: (
		accountAddress: string,
		tokenIssuer: string,
	) => Promise<void>;
}

const CreateBidModal = ({
	isOpen,
	onHide,
	isGetPlaceBidTransactionPending,
	handleSubmitBid,
	auctionId,
	isSubmitPlaceBidTransactionPending,
	isStellarLoading,
	publicKey,
	playerIssuer,
	checkTrustline,
	handleAddTrustline,
}: ICreateBidModalProps) => {
	const [hasEstablishedTrustline, setHasEstablishedTrustline] = useState(false);
	const addTrustline = async () => {
		await handleAddTrustline(publicKey, playerIssuer);
	};

	useEffect(() => {
		const handleCheckTrustline = async () => {
			const hasTrustline = await checkTrustline(publicKey, playerIssuer);

			setHasEstablishedTrustline(hasTrustline);
		};

		handleCheckTrustline();
	}, [checkTrustline, publicKey, playerIssuer]);

	if (!isOpen) {
		return null;
	}

	return (
		<div className="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
			<div className="relative z-10 w-[400px] h-auto p-6 bg-white rounded-lg shadow dark:bg-gray-700">
				<h6 className="mb-3 font-medium text-gray-900 dark:text-white">
					Create a Bid
				</h6>

				{hasEstablishedTrustline ? (
					<CreateBidForm
						onHide={onHide}
						isGetPlaceBidTransactionPending={isGetPlaceBidTransactionPending}
						handleSubmitBid={handleSubmitBid}
						auctionId={auctionId}
						isSubmitPlaceBidTransactionPending={
							isSubmitPlaceBidTransactionPending
						}
						isStellarLoading={isStellarLoading}
						publicKey={publicKey}
						playerIssuer={playerIssuer}
					/>
				) : (
					<div className="flex flex-col">
						<span className="mb-3 mt-2 font-medium text-gray-900 dark:text-white">
							Please add the NFT trustline to your wallet before creating a bid
						</span>
						<button
							onClick={onHide}
							className="bg-red-500 text-white p-2 my-1 rounded-md w-full h-10"
						>
							Cancel
						</button>
						<button
							onClick={addTrustline}
							className={`bg-green-500 text-white p-2 my-3 rounded-md w-full h-10 ${
								isStellarLoading ? 'opacity-50' : ''
							}`}
							disabled={isStellarLoading}
							data-test="add-trustline-btn"
						>
							{isStellarLoading ? (
								<div className="flex justify-center items-center h-full">
									<Loading />
								</div>
							) : (
								'Add Trustline'
							)}
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default CreateBidModal;
