import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import FootballField from './components/FootballField';
import FormationPlayersList from './components/FormationPlayersList';
import SaveFormationForm, {
	IFormationValues,
} from './components/SaveFormationForm';
import {
	IFormationLayout,
	IFormationPlayerPartial,
} from './interfaces/IFormationPlayers';
import { IFormationSubset } from './interfaces/IFormationSubset';
import { calculatePlayerPositions } from './utils/calculatePlayerPositions';
import { presetFormations } from './utils/presetFormations';
import { updateFormationPlayer } from './utils/updateFormationPlayer';

import {
	ERROR_CREATING_FORMATION,
	ERROR_UPDATING_FORMATION,
} from '@/constants/messages/formation-messages';
import { GET_TEAM_ERROR_MESSAGE } from '@/constants/messages/team-messages';
import { useGetMe } from '@/hooks/auth/useGetMe';
import { Position } from '@/interfaces/formation-player/IFormationPlayer.interface';
import { ICreateFormation } from '@/interfaces/formation/ICreateFormation.interface';
import { IFormation } from '@/interfaces/formation/IFormation.interface';
import { IUpdateFormation } from '@/interfaces/formation/IUpdateFormation';
import { IPlayer } from '@/interfaces/player/IPlayer';
import { ITeam } from '@/interfaces/team/ITeam';
import { formationService } from '@/services/formation.service';
import { notificationService } from '@/services/notification.service';
import { rosterService } from '@/services/roster.service';
import { teamService } from '@/services/team.service';

const Formation = () => {
	const { data: userData } = useGetMe();
	const [team, setTeam] = useState<ITeam | null>(null);
	const [rosterPlayers, setRosterPlayers] = useState<IPlayer[]>([]);
	const [selectedFormation, setSelectedFormation] = useState<IFormationSubset>(
		presetFormations[0],
	);
	const [selectedSavedFormation, setSelectedSavedFormation] =
		useState<IFormation>({ uuid: 'Default' } as IFormation);
	const [formations, setFormations] = useState<IFormation[]>([]);
	const [selectedSpot, setSelectedSpot] =
		useState<IFormationPlayerPartial | null>(null);
	const [formationLayout, setFormationLayout] = useState<IFormationLayout>({
		goalkeeper: [],
		defenders: [],
		midfielders: [],
		forwards: [],
	});
	const navigate = useNavigate();

	const handleSaveFormation = async (formationValues: IFormationValues) => {
		const { formationName, isActiveFormation } = formationValues;
		const { goalkeeper, midfielders, defenders, forwards } = formationLayout;
		const formationPlayers = [
			...goalkeeper,
			...defenders,
			...midfielders,
			...forwards,
		];

		const createFormation: ICreateFormation = {
			name: formationName,
			isActive: isActiveFormation,
			formationPlayers: formationPlayers.map(
				({ position, positionIndex, player }) => ({
					position: position ?? Position.Goalkeeper,
					playerUuid: player?.uuid ?? '',
					positionIndex: positionIndex ?? 0,
				}),
			),
			defenders: selectedFormation.defenders,
			forwards: selectedFormation.forwards,
			midfielders: selectedFormation.midfielders,
			rosterUuid: team?.rosterId ?? '',
		};

		try {
			const formation = await formationService.saveFormation(createFormation);
			const selectedSavedFormation = formation.data.attributes;
			const formationPlayersMappedByUuid =
				selectedSavedFormation?.formationPlayers.map((formationPlayer) => ({
					playerUuid: formationPlayer.player.uuid,
					formationPlayerUuid: formationPlayer.uuid,
				}));
			setRosterPlayers((previousRosterPlayers) =>
				previousRosterPlayers.map((player) => {
					const foundPlayer = formationPlayersMappedByUuid?.find(
						(formationPlayer) => formationPlayer.playerUuid === player.uuid,
					);
					if (foundPlayer) {
						return {
							...player,
							formationPlayerUuid: foundPlayer.formationPlayerUuid,
						};
					}
					return player;
				}),
			);
			notificationService.success(
				`${createFormation.defenders}-${createFormation.midfielders}-${createFormation.forwards} formation named ${createFormation.name} was successfully created. `,
			);
			setFormations((prev) => {
				const updatedFormations = isActiveFormation
					? prev.map((formation) => ({ ...formation, isActive: false }))
					: prev;

				return [...updatedFormations, formation.data.attributes];
			});
			if (selectedSavedFormation.uuid) {
				setSelectedSavedFormation(selectedSavedFormation);
			}
		} catch (error) {
			console.error(error);
			notificationService.error(ERROR_CREATING_FORMATION);
		}
	};

	const handleUpdateFormation = async (formationValues: IFormationValues) => {
		if (!selectedSavedFormation) {
			return;
		}
		const { formationName, isActiveFormation } = formationValues;
		const { goalkeeper, midfielders, defenders, forwards } = formationLayout;
		const formationPlayers = [
			...goalkeeper,
			...defenders,
			...midfielders,
			...forwards,
		];
		const newFormationPlayers: IFormationPlayerPartial[] = [];
		const formationPlayersUpdate: IFormationPlayerPartial[] = [];
		formationPlayers.forEach((formationPlayer) => {
			if (formationPlayer.uuid) {
				formationPlayersUpdate.push(formationPlayer);
			} else {
				newFormationPlayers.push(formationPlayer);
			}
		});

		const updateFormation: IUpdateFormation = {
			name: formationName,
			isActive: isActiveFormation,
			formationPlayers: formationPlayersUpdate.map(
				({ position, positionIndex, uuid }) => ({
					position: position ?? Position.Goalkeeper,
					positionIndex: positionIndex ?? 0,
					formationPlayerUuid: uuid,
				}),
			),
			defenders: selectedSavedFormation.defenders,
			forwards: selectedSavedFormation.forwards,
			midfielders: selectedSavedFormation.midfielders,
			formationUuid: selectedSavedFormation?.uuid ?? '',
			newFormationPlayers: newFormationPlayers.map(
				({ position, positionIndex, player, uuid }) => ({
					position: position ?? Position.Goalkeeper,
					playerUuid: player?.uuid ?? '',
					positionIndex: positionIndex ?? 0,
					formationPlayerUuid: uuid,
				}),
			),
		};
		try {
			await formationService.updateFormation(updateFormation);
			notificationService.success(
				`${updateFormation.defenders}-${updateFormation.midfielders}-${updateFormation.forwards} formation named ${updateFormation.name} was successfully updated. `,
			);
			setFormations((prev) =>
				prev.map((formation) => {
					if (formation.uuid === selectedSavedFormation.uuid) {
						return {
							...formation,
							isActive: isActiveFormation,
							name: formationName,
						};
					}
					if (isActiveFormation) {
						return { ...formation, isActive: false };
					}
					return { ...formation };
				}),
			);
		} catch (error) {
			console.error(error);
			notificationService.error(ERROR_UPDATING_FORMATION);
		}
	};

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

	const handleGetRosterPlayers = useCallback(
		async (rosterId: string) => {
			if (userData?.data.attributes.teamId) {
				try {
					const { data } = await rosterService.getAllPlayersFromRoster(
						rosterId,
					);

					setRosterPlayers(data.attributes.players.map((player) => player));
				} catch (error) {
					console.error(error);
					notificationService.error(GET_TEAM_ERROR_MESSAGE);
				}
			}
		},
		[userData?.data.attributes.teamId],
	);

	const handleGetFormations = useCallback(
		async (rosterUuid: string) => {
			if (userData?.data.attributes.teamId) {
				try {
					const { data } = await formationService.getAll({
						filters: {
							rosterUuid,
						},
					});
					setFormations(data.map(({ attributes }) => attributes));
				} catch (error) {
					console.error(error);
					notificationService.error(GET_TEAM_ERROR_MESSAGE);
				}
			}
		},
		[userData?.data.attributes.teamId],
	);

	useEffect(() => {
		handleGetTeam();
	}, [handleGetTeam]);

	useEffect(() => {
		if (team && team.rosterId) {
			handleGetRosterPlayers(team.rosterId);
		}
	}, [handleGetRosterPlayers, team]);

	useEffect(() => {
		if (team && team.rosterId) {
			handleGetFormations(team.rosterId);
		}
	}, [handleGetFormations, team]);

	useEffect(() => {
		setFormationLayout((prevFormationLayout) =>
			calculatePlayerPositions(selectedFormation, prevFormationLayout),
		);
	}, [selectedFormation]);

	const handleSelectSpot = (formationPlayer: IFormationPlayerPartial) => {
		if (!formationPlayer?.player) {
			setSelectedSpot(formationPlayer);
		}
	};

	const handleUpdateFormationSpotInLayout = (
		formationPlayer: IFormationPlayerPartial,
		player: IPlayer,
	) => {
		setFormationLayout((previousFormationLayout) => {
			const updateFormationLayout = (
				formationPlayerPartial: IFormationPlayerPartial[],
			) => {
				return updateFormationPlayer(
					formationPlayerPartial,
					formationPlayer,
					player,
				);
			};
			return {
				goalkeeper: updateFormationLayout(previousFormationLayout.goalkeeper),
				defenders: updateFormationLayout(previousFormationLayout.defenders),
				midfielders: updateFormationLayout(previousFormationLayout.midfielders),
				forwards: updateFormationLayout(previousFormationLayout.forwards),
			};
		});
		setSelectedSpot(null);
	};

	const handleRemovePlayerFromFormationLayout = (
		formationPlayer: IFormationPlayerPartial,
	) => {
		if (!formationPlayer.player) {
			return notificationService.error(
				"We couldn't find this player in the layout",
			);
		}

		setFormationLayout((previousFormationLayout) => {
			const removePlayerFromFormationLayout = (
				formationPlayerPartial: IFormationPlayerPartial[],
			) => {
				return updateFormationPlayer(
					formationPlayerPartial,
					formationPlayer,
					null,
				);
			};
			return {
				goalkeeper: removePlayerFromFormationLayout(
					previousFormationLayout.goalkeeper,
				),
				defenders: removePlayerFromFormationLayout(
					previousFormationLayout.defenders,
				),
				midfielders: removePlayerFromFormationLayout(
					previousFormationLayout.midfielders,
				),
				forwards: removePlayerFromFormationLayout(
					previousFormationLayout.forwards,
				),
			};
		});
	};

	const handleFormationChange = (event: ChangeEvent<HTMLSelectElement>) => {
		const formationId = parseInt(event.target.value);
		const formation = presetFormations.find(
			(presetFormation) => presetFormation.id === formationId,
		);
		if (formation) {
			setSelectedFormation(formation);
			setSelectedSavedFormation({ uuid: 'Default' } as IFormation);
			setRosterPlayers((previousRosterPlayers) => {
				return previousRosterPlayers.map((player) => ({
					...player,
					formationPlayerUuid: null,
				}));
			});
		}
	};

	const handleSavedFormationChange = async (
		event: ChangeEvent<HTMLSelectElement>,
	) => {
		const { value } = event.target;
		const foundedFormation = formations.find(
			(formation) => formation.uuid === value,
		);
		setSelectedSavedFormation({
			uuid: foundedFormation?.uuid,
			name: foundedFormation?.name,
		} as IFormation);

		const formation = await formationService.getFormationByUuid(value);
		const selectedSavedFormation = formation.data.attributes;
		if (selectedSavedFormation.uuid) {
			setSelectedSavedFormation(selectedSavedFormation);
		}
		const formationPlayersMappedByUuid =
			selectedSavedFormation?.formationPlayers.map((formationPlayer) => ({
				playerUuid: formationPlayer.player.uuid,
				formationPlayerUuid: formationPlayer.uuid,
			}));

		setRosterPlayers((previousRosterPlayers) =>
			previousRosterPlayers.map((player) => {
				const foundPlayer = formationPlayersMappedByUuid?.find(
					(formationPlayer) => formationPlayer.playerUuid === player.uuid,
				);
				if (foundPlayer) {
					return {
						...player,
						formationPlayerUuid: foundPlayer.formationPlayerUuid,
					};
				}
				return player;
			}),
		);
		const mappedFormation = Object.groupBy(
			formation.data.attributes.formationPlayers,
			(formationPlayer) => formationPlayer.position,
		);

		if (
			mappedFormation.Defender &&
			mappedFormation.Goalkeeper &&
			mappedFormation.Midfielder &&
			mappedFormation.Forward
		) {
			const draftFormation = {
				goalkeeper: mappedFormation.Goalkeeper,
				defenders: mappedFormation.Defender,
				midfielders: mappedFormation.Midfielder,
				forwards: mappedFormation.Forward,
			};
			setFormationLayout(
				calculatePlayerPositions(
					formation.data.attributes,
					draftFormation,
					true,
				),
			);
		}
	};

	const allPlayersInFormationLayout = [
		...formationLayout.goalkeeper,
		...formationLayout.defenders,
		...formationLayout.midfielders,
		...formationLayout.forwards,
	];

	const assignedPlayerUuids = allPlayersInFormationLayout.map(
		(formationPlayer) => formationPlayer?.player?.uuid,
	);

	if (!team) {
		return (
			<div className="flex flex-col gap-6 items-center justify-center mt-20">
				<p
					className="text-black w-full block text-center text-2xl font-bold"
					data-test="team-creation-title"
				>
					You must have a team to start creating formations
				</p>
				<button
					onClick={() => navigate('/team')}
					className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
					data-test="create-team-redirection"
				>
					Create Team
				</button>
			</div>
		);
	}
	return (
		<div className="flex flex-col gap-6 items-center justify-center bg-white">
			<div className="w-full max-w-[550px] flex flex-col justify-center items-center gap-6">
				<h1
					className="text-black w-full block text-left text-2xl font-bold"
					data-test="formation-title"
				>
					Tactical Formation: {selectedFormation.name}
				</h1>
				<div className="flex flex-row justify-between gap-4 w-full">
					<select
						id="formation"
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 bg-white focus:ring-blue-500"
						value={selectedFormation.id}
						onChange={handleFormationChange}
						data-test="formation-select"
					>
						{presetFormations.map((formation) => (
							<option key={formation.id} value={formation.id}>
								{formation.defenders}-{formation.midfielders}-
								{formation.forwards}
							</option>
						))}
					</select>
					<select
						id="formation"
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 bg-white focus:ring-blue-500"
						onChange={handleSavedFormationChange}
						value={selectedSavedFormation.uuid}
						data-test="saved-formations-select"
					>
						<option value="Default" disabled>
							Saved formations
						</option>
						{formations.map((formation) => (
							<option key={formation.uuid} value={formation.uuid}>
								{formation.name} ({formation.defenders}-{formation.midfielders}-
								{formation.forwards}) {formation.isActive && '(Active)'}
							</option>
						))}
					</select>
				</div>

				<SaveFormationForm
					handleUpdateFormation={handleUpdateFormation}
					handleSaveFormation={handleSaveFormation}
					selectedSavedFormation={selectedSavedFormation}
				>
					<FootballField
						players={formationLayout}
						handleRemovePlayerFromFormationLayout={
							handleRemovePlayerFromFormationLayout
						}
						handleSelectSpot={handleSelectSpot}
						selectedSpot={selectedSpot}
					/>
				</SaveFormationForm>

				<div className="bg-white p-2 rounded-lg shadow-lg w-full">
					<div
						className="flex w-full flex-col items-start"
						data-test="formation-players-list"
					>
						<h2 className="text-2xl font-bold text-center">Players</h2>
						<FormationPlayersList
							assignedPlayerUuids={assignedPlayerUuids}
							rosterPlayers={rosterPlayers}
							selectedSpot={selectedSpot}
							handleUpdateFormationSpotInLayout={
								handleUpdateFormationSpotInLayout
							}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Formation;
