import { UseMutateFunction } from '@tanstack/react-query';
import { Field, Form, Formik } from 'formik';
import { useCallback, useEffect, useRef, useState } from 'react';

import { PLAYER_REQUIRED_ERROR } from './player-messages';

import { ISingleResponse } from '@/interfaces/api/IApiBaseResponse';
import {
	IMintPlayerParams,
	ISubmitMintPlayerParams,
} from '@/interfaces/player/IMintPlayer';
import { IPlayer } from '@/interfaces/player/IPlayer';
import { ITransactionNFTData } from '@/interfaces/player/ITransactionNFT';
import { ISubmitMintPlayerContext } from '@/pages/transfer-market/hooks/useSubmitMintPlayer';
import { notificationService } from '@/services/notification.service';

interface IMintPlayerFormProps {
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

const MintPlayerForm = ({
	onHide,
	mintPlayer,
	isMintPlayerPending,
	mintPlayerData,
	submitMintPlayer,
	isSubmitMintPlayerPending,
	handleSignTransactionXDR,
}: IMintPlayerFormProps) => {
	const [name, setName] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const isLoading = isMintPlayerPending || isSubmitMintPlayerPending;
	const processedXdrRef = useRef<string | null>(null);
	const initialValues = {
		file: null,
		name: '',
		description: '',
	};

	const handleCompleteTransaction = useCallback(async () => {
		if (mintPlayerData?.data.attributes.xdr) {
			const currentXdr = mintPlayerData.data.attributes.xdr;
			if (processedXdrRef.current === currentXdr) {
				return;
			}

			const signedTransactionXdr = await handleSignTransactionXDR(currentXdr);

			if (signedTransactionXdr) {
				processedXdrRef.current = currentXdr;

				submitMintPlayer({
					xdr: signedTransactionXdr,
					metadataCid: mintPlayerData.data.attributes.metadataCid,
					imageCid: mintPlayerData.data.attributes.imageCid,
					issuer: mintPlayerData.data.attributes.issuer,
					name,
					description,
					onHide,
				});
			}
		}
	}, [
		mintPlayerData,
		handleSignTransactionXDR,
		submitMintPlayer,
		name,
		description,
		onHide,
	]);

	useEffect(() => {
		if (mintPlayerData?.data.attributes.xdr) {
			handleCompleteTransaction();
		}
	}, [mintPlayerData, handleCompleteTransaction]);

	const handleSubmit = async (values: IMintPlayerParams) => {
		if (!values.file) {
			notificationService.error(PLAYER_REQUIRED_ERROR);
			return;
		}

		mintPlayer({
			file: values.file,
			name: values.name,
			description: values.description,
		});

		setName(values.name);
		setDescription(values.description);
	};

	return (
		<Formik initialValues={initialValues} onSubmit={handleSubmit}>
			{({ setFieldValue }) => (
				<Form className="flex flex-col gap-4">
					<div className="flex flex-col">
						<label htmlFor="file" className="font-bold mb-1">
							Image
						</label>
						<input
							type="file"
							id="file"
							onChange={(e) => {
								const file = e.target.files?.[0];
								if (file) setFieldValue('file', file);
							}}
							data-test="mint-player-image-input"
						/>
					</div>

					<div className="flex flex-col">
						<label htmlFor="name" className="font-bold mb-1">
							Name
						</label>
						<Field
							type="text"
							id="name"
							name="name"
							className="border border-gray-300 rounded-md p-2"
							data-test="mint-player-name-input"
						/>
					</div>

					<div className="flex flex-col">
						<label htmlFor="description" className="font-bold mb-1">
							Description
						</label>
						<Field
							type="text"
							id="description"
							name="description"
							className="border border-gray-300 rounded-md p-2"
							data-test="mint-player-description-input"
						/>
					</div>

					<div className="flex justify-end gap-3 mt-2">
						<button
							type="button"
							onClick={onHide}
							className="px-4 py-2 bg-red-500 text-white border border-gray-300 rounded-md"
						>
							Cancel
						</button>
						<button
							type="submit"
							className={`px-4 py-2 bg-green-600 text-white rounded-md ${
								isLoading ? 'opacity-50 cursor-not-allowed' : ''
							}`}
							disabled={isLoading}
							data-test="mint-player-button"
						>
							{isLoading ? 'Minting...' : 'Mint'}
						</button>
					</div>
				</Form>
			)}
		</Formik>
	);
};

export default MintPlayerForm;
