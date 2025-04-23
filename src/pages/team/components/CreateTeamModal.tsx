import CreateTeamForm from './CreateTeamForm';

import { ICreateTeamParams } from '@/interfaces/team/ICreateTeam';

interface ICreateTeamModalProps {
	isOpen: boolean;
	onHide: () => void;
	handleCreateTeam(createTeamParams: ICreateTeamParams): Promise<void>;
	isLoading: boolean;
}

const CreateTeamModal = ({
	isOpen,
	onHide,
	handleCreateTeam,
	isLoading,
}: ICreateTeamModalProps) => {
	if (!isOpen) {
		return null;
	}

	return (
		<div className="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
			<div className="relative z-10 w-[400px] h-auto p-6 bg-white rounded-lg shadow dark:bg-gray-700">
				<h6 className="mb-3 font-medium text-gray-900 dark:text-white">
					Create a team
				</h6>

				<CreateTeamForm
					onHide={onHide}
					handleCreateTeam={handleCreateTeam}
					isLoading={isLoading}
				/>
			</div>
		</div>
	);
};

export default CreateTeamModal;
