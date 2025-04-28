import { Field, Form, Formik } from 'formik';
import { ReactNode } from 'react';

import { saveFormationSchema } from './schemas/saveFormationSchema';

import SwitchButton from '@/components/ui/SwitchButton';
import { IFormation } from '@/interfaces/formation/IFormation.interface';

export interface IFormationValues {
	formationName: string;
	isActiveFormation: boolean;
}
interface ISaveFormationFormProps {
	children: ReactNode;
	selectedSavedFormation: IFormation | null;
	handleSaveFormation: (formationValues: IFormationValues) => Promise<void>;
	handleUpdateFormation: (formationValues: IFormationValues) => Promise<void>;
}

const initialValues: IFormationValues = {
	formationName: '',
	isActiveFormation: false,
};

const SaveFormationForm = ({
	handleSaveFormation,
	handleUpdateFormation,
	children,
	selectedSavedFormation,
}: ISaveFormationFormProps) => {
	const handleSubmit = async (values: IFormationValues) => {
		if (selectedSavedFormation?.name) {
			await handleUpdateFormation(values);
		} else {
			await handleSaveFormation(values);
		}
	};

	return (
		<Formik
			initialValues={
				selectedSavedFormation?.name
					? {
							formationName: selectedSavedFormation.name,
							isActiveFormation: selectedSavedFormation.isActive ?? false,
					  }
					: initialValues
			}
			onSubmit={handleSubmit}
			enableReinitialize={true}
			validationSchema={saveFormationSchema}
		>
			{({ errors, touched, setFieldValue, values }) => (
				<Form
					className="flex flex-col justify-center items-center gap-6 w-full"
					data-test="save-formation-form"
				>
					<div className="relative flex flex-col gap-1 w-full">
						<Field
							type="text"
							name="formationName"
							className={`w-full p-2 border ${
								errors.formationName && touched.formationName
									? 'border-red-500'
									: 'border-gray-300'
							} rounded-md`}
							placeholder="Enter formation name..."
						/>
						{errors.formationName && touched.formationName && (
							<span className="absolute top-[100%] text-red-500 text-sm">
								{errors.formationName}
							</span>
						)}
					</div>
					<article className="w-full flex flex-grow justify-between gap-1">
						<span>Set the formation to active</span>
						<SwitchButton
							handleSwitchToggle={() => {
								setFieldValue('isActiveFormation', !values.isActiveFormation);
							}}
							isActive={values.isActiveFormation}
						/>
					</article>
					{children}
					<button
						type="submit"
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 rounded-lg text-sm h-11 self-end"
					>
						{selectedSavedFormation?.name ? (
							<span>Update formation</span>
						) : (
							<span className="">Save formation</span>
						)}
					</button>
				</Form>
			)}
		</Formik>
	);
};

export default SaveFormationForm;
