import { useCallback, useEffect, useState } from 'react';

import CreateTeamModal from './components/CreateTeamModal';

import Loading from '@/components/ui/Loading';
import {
	CREATE_TEAM_ERROR_MESSAGE,
	CREATE_TEAM_SUCCESS_MESSAGE,
	GET_TEAM_ERROR_MESSAGE,
} from '@/constants/messages/team-messages';
import { useGetMe } from '@/hooks/auth/useGetMe';
import { IPlayer } from '@/interfaces/player/IPlayer';
import { ICreateTeamParams } from '@/interfaces/team/ICreateTeam';
import { ITeam } from '@/interfaces/team/ITeam';
import { notificationService } from '@/services/notification.service';
import { playerService } from '@/services/player.service';
import { teamService } from '@/services/team.service';

export default function Team() {
	const { data: userData, refetch: refetchUserData } = useGetMe();
	const [team, setTeam] = useState<ITeam | null>(null);
	const [teamPlayers, setTeamPlayers] = useState<IPlayer[] | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] =
		useState<boolean>(false);

	const handleGetTeam = useCallback(async () => {
		if (userData?.data.attributes.teamId) {
			try {
				const { data } = await teamService.getTeamById(
					userData?.data.attributes.teamId,
				);
				setTeam(data.attributes);
			} catch (error) {
				console.error(error);
				notificationService.error(GET_TEAM_ERROR_MESSAGE);
			}
		}
	}, [userData?.data.attributes.teamId]);

	const handleGetTeamPlayers = useCallback(async () => {
		if (userData?.data.attributes.teamId) {
			try {
				const { data } = await playerService.getAll({
					filters: {
						teamId: userData?.data.attributes.teamId,
					},
				});
				setTeamPlayers(data.map((player) => player.attributes));
			} catch (error) {
				console.error(error);
				notificationService.error(GET_TEAM_ERROR_MESSAGE);
			}
		}
	}, [userData?.data.attributes.teamId]);

	const handleCreateTeam = async (createTeamParams: ICreateTeamParams) => {
		setIsLoading(true);
		try {
			await teamService.createTeam(createTeamParams);
			await refetchUserData();
			notificationService.success(CREATE_TEAM_SUCCESS_MESSAGE);
		} catch (error) {
			console.error(error);
			notificationService.error(CREATE_TEAM_ERROR_MESSAGE);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		handleGetTeam();
	}, [handleGetTeam]);

	useEffect(() => {
		handleGetTeamPlayers();
	}, [handleGetTeamPlayers]);

	if (!userData?.data.attributes.teamId || !team) {
		return (
			<div className="flex items-center justify-center h-screen flex-col">
				<CreateTeamModal
					isOpen={isCreateTeamModalOpen}
					onHide={() => setIsCreateTeamModalOpen(false)}
					handleCreateTeam={handleCreateTeam}
					isLoading={isLoading}
				/>
				<h1
					className="text-3xl font-bold underline text-center"
					data-test="home-msg"
				>
					You don't have a team yet
				</h1>
				<button
					className={`bg-blue-500 text-white p-2 my-3 rounded-md h-10 ${
						isLoading ? 'opacity-50' : ''
					}`}
					data-test="enable-auction-btn"
					disabled={isLoading || isCreateTeamModalOpen}
					onClick={() => setIsCreateTeamModalOpen(true)}
				>
					<div className="flex justify-center items-center h-full">
						{isLoading ? <Loading /> : 'Create a new team'}
					</div>
				</button>
			</div>
		);
	}

	return (
		<div className="flex h-screen flex-col p-4">
			<div className="flex w-full items-center justify-center flex-col">
				<div className="w-32 h-32 rounded-full overflow-hidden">
					<img src={team.logoUri} alt="Team logo" />
				</div>
				<h2 className="text-3xl font-bold text-center">
					Team:{' '}
					<span className="font-semibold" data-test="team-name">
						{team.name}
					</span>
				</h2>
			</div>

			<div className="flex w-full flex-col items-start">
				<h2 className="text-3xl font-bold text-center">Players: </h2>
				{teamPlayers?.length ? (
					teamPlayers.map((player) => (
						<div
							key={player.id}
							className="flex items-center justify-between w-full"
						>
							<div className="flex items-center">
								<span className="font-semibold">{player.name}</span>
							</div>
						</div>
					))
				) : (
					<span className="font-semibold" data-test="team-players">
						No players
					</span>
				)}
			</div>
		</div>
	);
}
