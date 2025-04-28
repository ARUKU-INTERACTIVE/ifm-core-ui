import { ChangeEvent, useCallback, useEffect, useState } from 'react';

import FootballField from './components/FootballField';
import FormationPlayersList from './components/FormationPlayersList';
import SaveFormationForm, {
	IFormationValues,
} from './components/SaveFormationForm';
import { IFormationSubset } from './interfaces/IFormationSubset';
import { IFormationSpot } from './interfaces/coordinates.interface';
import { IFormationLayout } from './interfaces/formation-players.interface';
import {
	calculatePlayerPosition,
	calculatePlayerPositions,
} from './utils/calculatePlayerPositions';
import { calculatePlayerSavedPositions } from './utils/calculatePlayerSavedPositions';
import { presetFormations } from './utils/presetFormations';

import { GET_TEAM_ERROR_MESSAGE } from '@/constants/messages/team-messages';
import { useGetMe } from '@/hooks/auth/useGetMe';
import { ICreateFormation } from '@/interfaces/formation/ICreateFormation.interface';
import { IFormation } from '@/interfaces/formation/IFormation.interface';
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
		useState<IFormation | null>(null);
	const [formations, setFormations] = useState<IFormation[]>([]);
	const [selectedSpot, setSelectedSpot] = useState<IFormationSpot | null>(null);
	const [formationLayout, setFormationLayout] = useState<IFormationLayout>({
		goalkeeper: [],
		defenders: [],
		midfielders: [],
		forwards: [],
	});
	const [formationDescription, setFormationDescription] = useState<string>('');
	console.log(formations, 'formations');

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
			description: formationDescription,
			formationPlayers: formationPlayers.map(
				({ position, positionIndex: order, player }) => ({
					position,
					playerUuid: player?.uuid ?? '',
					positionIndex: order,
				}),
			),
			defenders: selectedFormation.defenders,
			forwards: selectedFormation.forwards,
			midfielders: selectedFormation.midfielders,
			rosterUuid: team?.rosterId ?? '',
		};

		const formation = await formationService.saveFormation(createFormation);

		notificationService.success(
			`${createFormation.defenders}-${createFormation.midfielders}-${createFormation.forwards} formation named ${createFormation.name} was successfully created. `,
		);
		setFormations((prev) => [...prev, formation.data.attributes]);
	};

	const handleUpdateFormation = async (formationValues: IFormationValues) => {
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
			description: formationDescription,
			formationPlayers: formationPlayers.map(
				({ position, positionIndex: order, player }) => ({
					position,
					playerUuid: player?.uuid ?? '',
					positionIndex: order,
				}),
			),
			defenders: selectedFormation.defenders,
			forwards: selectedFormation.forwards,
			midfielders: selectedFormation.midfielders,
			rosterUuid: team?.rosterId ?? '',
		};

		//const formation = await formationService.saveFormation(createFormation);
		//
		notificationService.success(
			`${createFormation.defenders}-${createFormation.midfielders}-${createFormation.forwards} formation named ${createFormation.name} was successfully updated. `,
		);
		//setFormations((prev) => [...prev, formation.data.attributes]);
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
		setFormationLayout(
			calculatePlayerPosition(selectedFormation, formationLayout as any),
		);
		setFormationDescription(selectedFormation.name);
	}, [selectedFormation]);

	const handleSelectSpot = (formationSpot: IFormationSpot) => {
		setSelectedSpot(formationSpot);
	};

	const handleUpdateFormationSpotInLayout = (
		formationSpot: IFormationSpot,
		player: IPlayer,
	) => {
		setFormationLayout((prev) => {
			const updateLine = (line: IFormationSpot[]) =>
				line.map((s) =>
					s.positionIndex === formationSpot.positionIndex
						? { ...formationSpot, player }
						: s,
				);

			return {
				goalkeeper: updateLine(prev.goalkeeper),
				defenders: updateLine(prev.defenders),
				midfielders: updateLine(prev.midfielders),
				forwards: updateLine(prev.forwards),
			};
		});

		setRosterPlayers((prev) =>
			prev.filter((rosterPlayer) => rosterPlayer.uuid !== player.uuid),
		);
	};

	const handleRemovePlayerFromFormationLayout = (
		formationSpot: IFormationSpot,
	) => {
		if (!formationSpot.player) {
			return console.error('Not found player in formation layout');
		}
		setFormationLayout((prev) => {
			const updateLine = (line: IFormationSpot[]) =>
				line.map((s) =>
					s.positionIndex === formationSpot.positionIndex
						? { ...formationSpot, player: null }
						: s,
				);

			return {
				goalkeeper: updateLine(prev.goalkeeper),
				defenders: updateLine(prev.defenders),
				midfielders: updateLine(prev.midfielders),
				forwards: updateLine(prev.forwards),
			};
		});

		setRosterPlayers((prev) => [...prev, formationSpot.player as IPlayer]);
	};

	const handleFormationChange = (evt: ChangeEvent<HTMLSelectElement>) => {
		const formationId = parseInt(evt.target.value);
		const formation = presetFormations.find((f) => f.id === formationId);
		if (formation) {
			//setRosterPlayers((prev) => [
			//	...prev,
			//	...formationLayout.defenders
			//		.map(({ player }) => player)
			//		.filter((player) => player !== undefined && player !== null),
			//]);
			setSelectedFormation(formation);
			setSelectedSavedFormation(null);
			//setFormationLayout((prev) => ({
			//	defenders: [...prev.defenders,],
			//	forwards: [...prev.forwards],
			//	goalkeeper: [...prev.goalkeeper],
			//	midfielders: [...prev.midfielders],
			//}));
		}
	};

	const handleSavedFormationChange = async (
		evt: ChangeEvent<HTMLSelectElement>,
	) => {
		const { value } = evt.target;
		// const formation = formations.find((formation)=>formation.uuid === value)

		const formation = await formationService.getFormationByUuid(value);
		setSelectedSavedFormation(formation.data.attributes);

		const mappedFormation = Object.groupBy(
			formation.data.attributes.formationPlayers,
			(formationPlayer) => formationPlayer.position,
		);
		const playersUuIds = formation.data.attributes.formationPlayers.map(
			(formationPlayer) => formationPlayer.player.uuid,
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
				calculatePlayerPosition(formation.data.attributes, draftFormation),
			);
			setRosterPlayers((prev) =>
				prev.filter((player) => !playersUuIds.includes(player.uuid)),
			);
		}
	};

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
						value={selectedSavedFormation?.uuid}
						data-test="saved-formations-select"
					>
						<option value="" disabled selected>
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
