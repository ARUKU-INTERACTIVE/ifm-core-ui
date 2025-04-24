import { useCallback, useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import PlayerCard from '../transfer-market/components/PlayerCard';
import CreateTeamModal from './components/CreateTeamModal';
import { ITEMS_PER_PLAYERS_PAGE } from './constants/team.constant';

import Loading from '@/components/ui/Loading';
import {
	ADD_PLAYER_TO_ROSTER_ERROR_MESSAGE,
	CREATE_TEAM_ERROR_MESSAGE,
	CREATE_TEAM_SUCCESS_MESSAGE,
	GET_TEAM_ERROR_MESSAGE,
	REMOVE_PLAYER_FROM_ROSTER_ERROR_MESSAGE,
} from '@/constants/messages/team-messages';
import { useGetMe } from '@/hooks/auth/useGetMe';
import { IPlayer } from '@/interfaces/player/IPlayer';
import { ICreateTeamParams } from '@/interfaces/team/ICreateTeam';
import { ITeam } from '@/interfaces/team/ITeam';
import { notificationService } from '@/services/notification.service';
import { playerService } from '@/services/player.service';
import { rosterService } from '@/services/roster.service';
import { teamService } from '@/services/team.service';

export default function Team() {
	const { data: userData, refetch: refetchUserData } = useGetMe();
	const [team, setTeam] = useState<ITeam | null>(null);
	const [teamPlayers, setTeamPlayers] = useState<IPlayer[] | null>(null);
	const [rosterPlayersCount, setRosterPlayersCount] = useState<number>(0);
	const [rosterPlayers, setRosterPlayers] = useState<IPlayer[] | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] =
		useState<boolean>(false);

	const [isLoadingRosterOperation, setIsLoadingRosterOperation] =
		useState<boolean>(false);
	const [selectedTab, setSelectedTab] = useState(0);
	const [currentPlayersPage, setCurrentPlayersPage] = useState(1);

	const [pageCountPlayers, setPageCountPlayers] = useState(0);

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
				const { data, meta } = await playerService.getAll({
					filters: {
						teamId: userData?.data.attributes.teamId,
					},
					page: {
						number: currentPlayersPage,
						size: ITEMS_PER_PLAYERS_PAGE,
					},
				});
				setTeamPlayers(
					data.map((player) => {
						const playerId = player.id ?? '';
						return { ...player.attributes, id: playerId.toString() };
					}),
				);
				setPageCountPlayers(meta.pageCount);
			} catch (error) {
				console.error(error);
				notificationService.error(GET_TEAM_ERROR_MESSAGE);
			}
		}
	}, [userData?.data.attributes.teamId, currentPlayersPage]);

	const handleGetRosterPlayers = useCallback(async () => {
		if (team?.rosterId) {
			const { data } = await rosterService.getAllPlayersFromRoster(
				team.rosterId,
			);
			setRosterPlayersCount(data.attributes.players.length);
			setRosterPlayers(
				data.attributes.players.map((player) => {
					const playerId = player.id ?? '';
					return {
						...player,
						id: playerId.toString(),
					};
				}),
			);
		}
	}, [team?.rosterId]);

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

	const handleAddPlayerToRoster = async (playerId: string) => {
		try {
			setIsLoadingRosterOperation(true);
			if (team?.rosterId) {
				await rosterService.addPlayerToRoster(playerId, team.rosterId);
				await handleGetRosterPlayers();
				await handleGetTeamPlayers();
			}
		} catch (error) {
			console.error(error);
			notificationService.error(ADD_PLAYER_TO_ROSTER_ERROR_MESSAGE);
		} finally {
			setIsLoadingRosterOperation(false);
		}
	};

	const handleRemovePlayerFromRoster = async (playerId: string) => {
		try {
			setIsLoadingRosterOperation(true);
			if (team?.rosterId) {
				await rosterService.removePlayerFromRoster(playerId, team.rosterId);
				await handleGetRosterPlayers();
				await handleGetTeamPlayers();
			}
		} catch (error) {
			console.error(error);
			notificationService.error(REMOVE_PLAYER_FROM_ROSTER_ERROR_MESSAGE);
		} finally {
			setIsLoadingRosterOperation(false);
		}
	};

	const handlePageChange = ({ selected }: { selected: number }) => {
		setCurrentPlayersPage(selected + 1);
	};

	useEffect(() => {
		handleGetTeam();
	}, [handleGetTeam]);

	useEffect(() => {
		handleGetTeamPlayers();
	}, [handleGetTeamPlayers]);

	useEffect(() => {
		handleGetRosterPlayers();
	}, [handleGetRosterPlayers]);

	useEffect(() => {
		if (userData?.data.attributes.teamId) {
			playerService.syncPlayers();
		}
	}, [userData?.data.attributes.teamId]);

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
					data-test="team-home-msg"
				>
					You don't have a team yet
				</h1>
				<button
					className={`bg-blue-500 text-white p-2 my-3 rounded-md h-10 ${
						isLoading ? 'opacity-50' : ''
					}`}
					data-test="create-team-btn"
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
					<p>Team</p>
					<span className="font-semibold" data-test="team-name">
						{team.name}
					</span>
				</h2>
			</div>

			<div className="flex flex-col w-full items-start p-4">
				<div className="flex items-center justify-center gap-2">
					<p className="text-2xl font-semibold">Players in Roster: </p>
					<p className="text-2xl font-bold">{rosterPlayersCount}/11</p>
				</div>
				<Tabs
					selectedIndex={selectedTab}
					onSelect={(index) => {
						setSelectedTab(index);
						setCurrentPlayersPage(1);
					}}
					className="w-full mt-10 max-w-[100rem] mx-auto border border-gray-300 rounded-b-lg shadow-md bg-white"
					data-test="team-players-tabs"
				>
					<TabList className="flex border-b border-gray-200 bg-gray-100">
						<Tab
							className={`w-1/2 text-center py-3 text-lg font-semibold cursor-pointer transition-colors duration-300 focus:outline-none ${
								selectedTab === 0
									? 'bg-white border-b-2 border-blue-500 text-blue-600'
									: 'text-gray-500 hover:text-blue-500'
							}`}
							data-test="team-players-tab"
						>
							Players
						</Tab>
						<Tab
							className={`w-1/2 text-center py-3 text-lg font-semibold cursor-pointer transition-colors duration-300 focus:outline-none ${
								selectedTab === 1
									? 'bg-white border-b-2 border-blue-500 text-blue-600'
									: 'text-gray-500 hover:text-blue-500'
							}`}
							data-test="team-roster-tab"
						>
							Roster
						</Tab>
					</TabList>

					<TabPanel className="p-6" data-test="team-players-tab-panel">
						<div className="flex flex-wrap justify-evenly gap-4 py-3 ">
							{teamPlayers?.length ? (
								teamPlayers.map((player) => {
									return (
										<div key={player.uuid} className="flex items-center pt-3">
											<PlayerCard
												key={player.name}
												player={player}
												isInTeam={true}
												addPlayerToRoster={handleAddPlayerToRoster}
												removePlayerFromRoster={handleRemovePlayerFromRoster}
												isLoadingOperation={isLoadingRosterOperation}
											/>
										</div>
									);
								})
							) : (
								<p
									className=" text-gray-600 font-semibold"
									data-test="team-players-no-players"
								>
									No players in team
								</p>
							)}
						</div>
						<ReactPaginate
							pageCount={pageCountPlayers}
							pageRangeDisplayed={2}
							marginPagesDisplayed={1}
							onPageChange={handlePageChange}
							containerClassName="flex justify-center mt-6 gap-2"
							pageClassName="px-2.5 rounded-full border cursor-pointer"
							activeClassName="bg-blue-500 rounded-full text-white"
							previousLabel="<"
							nextLabel=">"
							breakLabel="..."
							disabledClassName="opacity-50 cursor-not-allowed"
							data-test="team-players-pagination"
						/>
					</TabPanel>

					<TabPanel className="p-6" data-test="team-roster-tab-panel">
						<div className="flex flex-wrap justify-evenly gap-4 py-3 ">
							{rosterPlayers?.length ? (
								rosterPlayers.map((player) => {
									return (
										<PlayerCard
											key={player.uuid}
											player={player}
											isInTeam={true}
											removePlayerFromRoster={handleRemovePlayerFromRoster}
											isLoadingOperation={isLoadingRosterOperation}
										/>
									);
								})
							) : (
								<p
									className="text-gray-600 font-semibold"
									data-test="team-roster-no-players"
								>
									No players in roster
								</p>
							)}
						</div>
					</TabPanel>
				</Tabs>
			</div>
		</div>
	);
}
