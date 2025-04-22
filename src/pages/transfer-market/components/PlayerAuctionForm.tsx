import { Field, Form, Formik } from 'formik';

import { auctionPlayerSchema } from '@/components/player/schemas/auction-player.schema';
import Loading from '@/components/ui/Loading';
import { ICreateAuctionFormValues } from '@/interfaces/auction/ICreateAuctionTransaction';

interface IPlayerAuctionFormProps {
	playerId: string;
	submitCreateAuctionTransaction: (
		values: ICreateAuctionFormValues,
		playerId: string,
	) => Promise<void>;
	onHide: () => void;
	isSubmittingCreateAuctionTransaction: boolean;
}

const PlayerAuctionForm = ({
	playerId,
	submitCreateAuctionTransaction,
	onHide,
	isSubmittingCreateAuctionTransaction,
}: IPlayerAuctionFormProps) => {
	const initialValues = {
		startingPrice: 0,
		auctionTimeInHours: 0,
	};
	return (
		<Formik
			initialValues={initialValues}
			onSubmit={(values) => submitCreateAuctionTransaction(values, playerId)}
			validationSchema={auctionPlayerSchema}
		>
			{({ errors, touched }) => (
				<Form>
					<div className="col-span-3 py-3">
						<div className="flex flex-col gap-2">
							<label htmlFor="startingPrice" className="dark:text-white">
								Starting Price
							</label>
							{errors.startingPrice && touched.startingPrice && (
								<span className="text-red-500 text-sm">
									{errors.startingPrice}
								</span>
							)}
							<div className="relative flex items-center">
								<span className="absolute left-3 text-gray-500 mb-3">$</span>
								<Field
									type="number"
									id="startingPrice"
									name="startingPrice"
									className={`w-full p-2 pl-7 border ${
										errors.startingPrice && touched.startingPrice
											? 'border-red-500'
											: 'border-gray-300'
									} rounded-md mb-5`}
									data-test="starting-price-input"
								/>
							</div>
						</div>

						<div className="flex flex-col gap-2">
							<label htmlFor="auctionTimeInHours" className="dark:text-white">
								Auction Duration (hours)
							</label>
							{errors.auctionTimeInHours && touched.auctionTimeInHours && (
								<span className="text-red-500 text-sm">
									{errors.auctionTimeInHours}
								</span>
							)}
							<Field
								type="number"
								id="auctionTimeInHours"
								name="auctionTimeInHours"
								className={`w-full p-2 pl-7 border ${
									errors.auctionTimeInHours && touched.auctionTimeInHours
										? 'border-red-500'
										: 'border-gray-300'
								} rounded-md mb-3`}
								data-test="auction-time-input"
							/>
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
								className={`bg-blue-500 text-white p-2 my-3 rounded-md w-full h-10 ${
									isSubmittingCreateAuctionTransaction ? 'opacity-50' : ''
								}`}
								type="submit"
								data-test="submit-auction-btn"
								disabled={isSubmittingCreateAuctionTransaction}
							>
								{isSubmittingCreateAuctionTransaction ? (
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

export default PlayerAuctionForm;
