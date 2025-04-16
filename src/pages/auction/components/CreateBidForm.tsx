import { Field, Form, Formik } from 'formik';

import { auctionBidSchema } from '@/components/player/schemas/auction-bid.schema';
import Loading from '@/components/ui/Loading';
import { IGetPlaceBidTransactionParams } from '@/interfaces/auction/IGetPlaceBidTransaction';
import { convertPriceToStroops } from '@/utils/convertPriceToStroops';

interface ICreateBidFormProps {
	onHide: () => void;
	isGetPlaceBidTransactionPending: boolean;
	handleSubmitBid(
		getPlaceBidTransactionParams: IGetPlaceBidTransactionParams,
	): Promise<void>;
	auctionId: string;
	isSubmitPlaceBidTransactionPending: boolean;
}

const CreateBidForm = ({
	onHide,
	isGetPlaceBidTransactionPending,
	handleSubmitBid,
	auctionId,
	isSubmitPlaceBidTransactionPending,
}: ICreateBidFormProps) => {
	const initialValues = {
		bidAmount: 0,
	};
	const isLoading =
		isGetPlaceBidTransactionPending || isSubmitPlaceBidTransactionPending;

	const handleSubmit = async (values: typeof initialValues) => {
		const { bidAmount } = values;

		await handleSubmitBid({
			auctionId: Number(auctionId),
			bidAmount: convertPriceToStroops(bidAmount),
		});

		onHide();
	};

	return (
		<Formik
			initialValues={initialValues}
			onSubmit={handleSubmit}
			validationSchema={auctionBidSchema}
		>
			{({ errors, touched }) => (
				<Form>
					<div className="col-span-3 py-3">
						<div className="flex flex-col gap-2">
							<label htmlFor="bidAmount" className="dark:text-white">
								Bid Amount
							</label>
							{errors.bidAmount && touched.bidAmount && (
								<span className="text-red-500 text-sm">{errors.bidAmount}</span>
							)}
							<div className="relative flex items-center">
								<span className="absolute left-3 text-gray-500 mb-5">$</span>
								<Field
									type="number"
									id="bidAmount"
									name="bidAmount"
									className={`w-full p-2 pl-7 border ${
										errors.bidAmount && touched.bidAmount
											? 'border-red-500'
											: 'border-gray-300'
									} rounded-md mb-5`}
									data-test="bid-amount-input"
								/>
							</div>
						</div>

						<div className="flex flex-col pt-2 gap-2">
							<button
								className="bg-red-500 text-white p-2 mt-3 rounded-md w-full h-10"
								type="button"
								onClick={onHide}
							>
								Cancel
							</button>

							<button
								className={`bg-green-500 text-white p-2 my-3 rounded-md w-full h-10 ${
									isLoading ? 'opacity-50' : ''
								}`}
								type="submit"
								data-test="submit-bid-btn"
								disabled={isLoading}
							>
								{isLoading ? (
									<div className="flex justify-center items-center h-full">
										<Loading />
									</div>
								) : (
									'Submit'
								)}
							</button>
						</div>
					</div>
				</Form>
			)}
		</Formik>
	);
};

export default CreateBidForm;
