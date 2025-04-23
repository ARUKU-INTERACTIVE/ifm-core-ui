import { Field, Form, Formik } from 'formik';

import FileInput from './FileFormField';
import { mintPlayerSchema } from './schemas/mint-player.schema';

import { IMintPlayerFormValues } from '@/interfaces/player/IMintPlayer';

interface IMintPlayerFormProps {
	onHide: () => void;
	mintPlayer: (params: IMintPlayerFormValues) => Promise<void>;
	isMintPlayerPending: boolean;
	isSubmitMintPlayerPending: boolean;
}

const MintPlayerForm = ({
	onHide,
	mintPlayer,
	isMintPlayerPending,
	isSubmitMintPlayerPending,
}: IMintPlayerFormProps) => {
	const isLoading = isMintPlayerPending || isSubmitMintPlayerPending;
	const initialValues = {
		file: null,
		name: '',
		description: '',
	};

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={mintPlayerSchema}
			onSubmit={mintPlayer}
		>
			{() => {
				return (
					<Form className="flex flex-col gap-4">
						<div className="flex flex-col">
							<FileInput
								name="file"
								label="Image "
								dataTest="mint-player-image-input"
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
				);
			}}
		</Formik>
	);
};

export default MintPlayerForm;
