import { Field, Form, Formik, FormikHelpers } from 'formik';

import { saveFormationSchema } from './schemas/saveFormationSchema';

interface ISaveFormationFormProps {
	handleSaveFormation: (formationName: string) => Promise<void>;
}

const SaveFormationForm = ({
	handleSaveFormation,
}: ISaveFormationFormProps) => {
	const initialValues = {
		formationName: '',
	};

	const handleSubmit = async (
		values: typeof initialValues,
		{ resetForm }: FormikHelpers<typeof initialValues>,
	) => {
		const { formationName } = values;

		await handleSaveFormation(formationName);

		resetForm();
	};

	return (
		<Formik
			initialValues={initialValues}
			onSubmit={handleSubmit}
			validationSchema={saveFormationSchema}
		>
			{({ errors, touched }) => (
				<Form
					className="flex flex-row gap-4 w-[512px]"
					data-test="save-formation-form"
				>
					{errors.formationName && touched.formationName && (
						<span className="text-red-500 text-sm">{errors.formationName}</span>
					)}
					<Field
						type="text"
						name="formationName"
						className={`w-full p-2 pl-7 border ${
							errors.formationName && touched.formationName
								? 'border-red-500'
								: 'border-gray-300'
						} rounded-md mb-5`}
						placeholder="Enter formation name..."
					/>
					<button
						type="submit"
						className={`bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 rounded-lg text-sm h-11`}
					>
						Save Formation
					</button>
				</Form>
			)}
		</Formik>
	);
};

export default SaveFormationForm;
