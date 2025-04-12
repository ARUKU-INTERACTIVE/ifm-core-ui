import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { Field, Form, Formik } from 'formik';
import { useCallback, useEffect, useRef, useState } from 'react';

import Loading from '@/components/ui/Loading';
import { ISingleResponse } from '@/interfaces/api/IApiBaseResponse';
import { ITransactionResponse } from '@/interfaces/api/ITransactionResponse';
import { IAuction } from '@/interfaces/auction/IAuction';
import { ICreateAuctionTransactionParams } from '@/interfaces/auction/ICreateAuctionTransaction';
import { ISubmitCreateAuctionTransactionParams } from '@/interfaces/auction/ISubmitCreateAuction';
import { SUBMIT_CREATE_AUCTION_ERROR_MESSAGE } from '@/interfaces/auction/auction-messages';
import { notificationService } from '@/services/notification.service';
import { convertPriceToStroops } from '@/utils/convertPriceToStroops';
import { convertTimeToMs } from '@/utils/convertTimeToMs';

interface PlayerAuctionFormProps {
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
	onHide: () => void;
	isSubmittingCreateAuctionTransaction: boolean;
}
const PlayerAuctionForm = ({
	playerId,
	createAuctionTransaction,
	submitCreateAuctionTransaction,
	handleSignTransactionXDR,
	createAuctionTransactionXDR,
	onHide,
	isSubmittingCreateAuctionTransaction,
}: PlayerAuctionFormProps) => {
	const initialValues = {
		startingPrice: 0,
		auctionTimeInHours: 0,
	};
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const processedXdrRef = useRef<string | null>(null);

	const handleSubmitCreateAuction = useCallback(async () => {
		if (createAuctionTransactionXDR?.data.attributes.xdr) {
			const currentXDR = createAuctionTransactionXDR.data.attributes.xdr;
			if (processedXdrRef.current === currentXDR) {
				return;
			}

			const signedTransactionXDR = await handleSignTransactionXDR(currentXDR);

			if (signedTransactionXDR) {
				processedXdrRef.current = currentXDR;

				try {
					await submitCreateAuctionTransaction({
						externalId: Number(createAuctionTransactionXDR?.data.id),
						playerId: Number(playerId),
						xdr: signedTransactionXDR,
					});
				} catch (error) {
					notificationService.error(SUBMIT_CREATE_AUCTION_ERROR_MESSAGE);
				} finally {
					setIsLoading(false);
				}
			}
		}
	}, [
		handleSignTransactionXDR,
		submitCreateAuctionTransaction,
		createAuctionTransactionXDR,
		playerId,
	]);

	useEffect(() => {
		if (createAuctionTransactionXDR?.data.attributes.xdr) {
			handleSubmitCreateAuction();
		}
	}, [createAuctionTransactionXDR, handleSubmitCreateAuction]);

	const handleSubmitAuction = async (values: typeof initialValues) => {
		setIsLoading(true);
		const { startingPrice, auctionTimeInHours } = values;

		await createAuctionTransaction({
			playerId: playerId,
			startingPrice: convertPriceToStroops(startingPrice),
			auctionTimeMs: convertTimeToMs(auctionTimeInHours),
		});
		setIsLoading(false);
	};

	return (
		<Formik initialValues={initialValues} onSubmit={handleSubmitAuction}>
			<Form>
				<div className="col-span-3">
					<div className="flex flex-col gap-2">
						<label htmlFor="startingPrice" className="text-sm dark:text-white">
							Starting Price
						</label>
						<div className="relative flex items-center">
							<span className="absolute left-3 text-gray-500 mb-3">$</span>
							<Field
								type="number"
								id="startingPrice"
								name="startingPrice"
								className="w-full p-2 pl-7 border border-gray-300 rounded-md mb-3"
								data-test="starting-price-input"
							/>
						</div>
					</div>

					<div className="flex flex-col gap-2">
						<label
							htmlFor="auctionTimeInHours"
							className="text-sm dark:text-white"
						>
							Auction Duration (hours)
						</label>
						<Field
							type="number"
							id="auctionTimeInHours"
							name="auctionTimeInHours"
							className="w-full p-2 pl-7 border border-gray-300 rounded-md mb-3"
							data-test="auction-time-input"
						/>
					</div>
					<div className="flex flex-col">
						<button
							className="bg-red-500 text-white p-2 mt-3 rounded-md w-full h-10"
							type="button"
							onClick={onHide}
						>
							Cancel
						</button>

						<button
							className={`bg-blue-500 text-white p-2 my-3 rounded-md w-full h-10 ${
								isLoading || isSubmittingCreateAuctionTransaction
									? 'opacity-50'
									: ''
							}`}
							type="submit"
							data-test="submit-auction-btn"
							disabled={isLoading || isSubmittingCreateAuctionTransaction}
						>
							{isLoading || isSubmittingCreateAuctionTransaction ? (
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
		</Formik>
	);
};

export default PlayerAuctionForm;
