import { Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';

import { PLAYER_REQUIRED_ERROR } from './player-messages';

import { useWallet } from '@/hooks/auth/useWallet';
import { IMintPlayerParams } from '@/interfaces/player/IMintPlayer';
import { useMintPlayer } from '@/pages/transfer-market/hooks/useMintPlayer';
import { useSubmitMintPlayer } from '@/pages/transfer-market/hooks/useSubmitMintPlayer';
import { notificationService } from '@/services/notification.service';

type MintPlayerFormProps = {
	onHide: () => void;
};

const MintPlayerForm = ({ onHide }: MintPlayerFormProps) => {
	const {
		mutate: mintPlayer,
		isPending: isMintPlayerPending,
		data: mintPlayerData,
	} = useMintPlayer();
	const { mutate: submitMintPlayer, isPending: isSubmitMintPlayerPending } =
		useSubmitMintPlayer();
	const { handleSignTransactionXDR } = useWallet();
	const [name, setName] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const isButtonDisabled = isMintPlayerPending || isSubmitMintPlayerPending;
	const initialValues = {
		file: null,
		name: '',
		description: '',
	};

	useEffect(() => {
		async function handleMintPlayer() {
			if (mintPlayerData?.data.attributes.xdr) {
				const signedTransactionXdr = await handleSignTransactionXDR(
					mintPlayerData.data.attributes.xdr,
				);

				submitMintPlayer({
					xdr: signedTransactionXdr as string,
					metadataCid: mintPlayerData.data.attributes.metadataCid,
					imageCid: mintPlayerData.data.attributes.imageCid,
					issuer: mintPlayerData.data.attributes.issuer,
					name,
					description,
					onHide,
				});
			}
		}

		handleMintPlayer();
	}, [
		mintPlayerData,
		handleSignTransactionXDR,
		submitMintPlayer,
		name,
		description,
		onHide,
	]);

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
								isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''
							}`}
							disabled={isButtonDisabled}
							data-test="mint-player-button"
						>
							{isButtonDisabled ? 'Minting...' : 'Mint'}
						</button>
					</div>
				</Form>
			)}
		</Formik>
	);
};

export default MintPlayerForm;
