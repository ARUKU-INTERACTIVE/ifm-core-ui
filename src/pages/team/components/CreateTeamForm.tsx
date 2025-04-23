import { Field, Form, Formik } from 'formik';

import Loading from '@/components/ui/Loading';
import { createTeamSchema } from '@/constants/schemas/create-team.schema';
import { ICreateTeamParams } from '@/interfaces/team/ICreateTeam';

interface ICreateTeamFormProps {
	onHide: () => void;
	handleCreateTeam(createTeamParams: ICreateTeamParams): Promise<void>;
	isLoading: boolean;
}

const CreateTeamForm = ({
	onHide,
	handleCreateTeam,
	isLoading,
}: ICreateTeamFormProps) => {
	const initialValues = {
		logoUri: '',
		name: '',
	};

	const handleSubmit = async (values: typeof initialValues) => {
		await handleCreateTeam(values);
		onHide();
	};

	return (
		<Formik
			initialValues={initialValues}
			onSubmit={handleSubmit}
			validationSchema={createTeamSchema}
		>
			{({ errors, touched }) => (
				<Form>
					<div className="col-span-3 py-3">
						<div className="flex flex-col gap-2">
							<label htmlFor="name" className="dark:text-white">
								Name
							</label>
							{errors.name && touched.name && (
								<span className="text-red-500 text-sm">{errors.name}</span>
							)}
							<div className="relative flex items-center">
								<Field
									type="text"
									name="name"
									className={`w-full p-2 pl-7 border ${
										errors.name && touched.name
											? 'border-red-500'
											: 'border-gray-300'
									} rounded-md mb-5`}
									data-test="team-name-input"
								/>
							</div>
						</div>

						<div className="flex flex-col gap-2">
							<label htmlFor="logo" className="dark:text-white">
								Logo URL
							</label>
							{errors.logoUri && touched.logoUri && (
								<span className="text-red-500 text-sm">{errors.logoUri}</span>
							)}
							<div className="relative flex items-center">
								<Field
									type="text"
									name="logoUri"
									className={`w-full p-2 pl-7 border ${
										errors.logoUri && touched.logoUri
											? 'border-red-500'
											: 'border-gray-300'
									} rounded-md mb-5`}
									data-test="team-logo-input"
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
								data-test="submit-create-team-btn"
								disabled={isLoading}
							>
								{isLoading ? (
									<div className="flex justify-center items-center h-full">
										<Loading />
									</div>
								) : (
									'Create team'
								)}
							</button>
						</div>
					</div>
				</Form>
			)}
		</Formik>
	);
};

export default CreateTeamForm;
