import { ChangeEvent, useCallback, useEffect, useState } from 'react';

import PlayerCard from '../transfer-market/components/PlayerCard';
import FootballField from './components/FootballField';
import PlayerFormationCard from './components/PlayerFormationCard';
import { IFormationSpot } from './interfaces/coordinates.interface';
import {
	IFormationLayout,
	IFormationSavedLayout,
} from './interfaces/formation-players.interface';

import { GET_TEAM_ERROR_MESSAGE } from '@/constants/messages/team-messages';
import { useGetMe } from '@/hooks/auth/useGetMe';
import {
	IFormationPlayer,
	Position,
} from '@/interfaces/formation-player/IFormationPlayer.interface';
import { ICreateFormation } from '@/interfaces/formation/ICreateFormation.interface';
import { IFormation } from '@/interfaces/formation/IFormation.interface';
import { IPlayer } from '@/interfaces/player/IPlayer';
import { ITeam } from '@/interfaces/team/ITeam';
import { formationService } from '@/services/formation.service';
import { notificationService } from '@/services/notification.service';
import { rosterService } from '@/services/roster.service';
import { teamService } from '@/services/team.service';

interface IFormationStructure {
	id: number;
	name: string;
	defenders: number;
	midFielders: number;
	forwards: number;
}

const formationsStructure: IFormationStructure[] = [
	{ id: 1, name: '4-4-2', defenders: 4, midFielders: 4, forwards: 2 },
	{ id: 2, name: '4-3-3', defenders: 4, midFielders: 3, forwards: 3 },
	{ id: 3, name: '4-5-1', defenders: 4, midFielders: 5, forwards: 1 },
	{ id: 4, name: '3-5-2', defenders: 3, midFielders: 5, forwards: 2 },
	{ id: 5, name: '3-4-3', defenders: 3, midFielders: 4, forwards: 3 },
	{ id: 6, name: '5-3-2', defenders: 5, midFielders: 3, forwards: 2 },
	{ id: 7, name: '5-4-1', defenders: 5, midFielders: 4, forwards: 1 },
	{ id: 8, name: '4-2-4', defenders: 4, midFielders: 2, forwards: 4 },
	{ id: 9, name: '3-6-1', defenders: 3, midFielders: 6, forwards: 1 },
	{ id: 10, name: '5-2-3', defenders: 5, midFielders: 2, forwards: 3 },
];

const calculatePlayerPositions = (
	formation: IFormationStructure,
): IFormationLayout => {
	const formationLayout: IFormationLayout = {
		defenders: [],
		midFielders: [],
		forwards: [],
		goalkeeper: [],
	};
	let positionIndex = 1;
	formationLayout.goalkeeper.push({
		positionIndex,
		position: Position.Goalkeeper,
	});
	positionIndex += 1;
	// Calcula posiciones de defensas
	for (let i = 0; i < formation.defenders; i++) {
		formationLayout.defenders.push({
			positionIndex,
			position: Position.Defender,
		});
		positionIndex += 1;
	}

	// Calcula posiciones de mediocampistas
	for (let i = 0; i < formation.midFielders; i++) {
		formationLayout.midFielders.push({
			positionIndex,
			position: Position.Midfielder,
		});
		positionIndex += 1;
	}

	// Calcula posiciones de delanteros
	for (let i = 0; i < formation.forwards; i++) {
		formationLayout.forwards.push({
			positionIndex,
			position: Position.Forward,
		});
		positionIndex += 1;
	}

	return formationLayout;
};

const calculatePlayerSavedPositions = (
	formation: IFormation,
	formationSavedLayout: IFormationSavedLayout,
): IFormationLayout => {
	const formationDraftLayout: IFormationLayout = {
		defenders: [],
		midFielders: [],
		forwards: [],
		goalkeeper: [],
	};
	let positionIndex = 1;
	formationDraftLayout.goalkeeper.push({
		positionIndex,
		position: Position.Goalkeeper,
		player: formationSavedLayout.goalkeeper[0].player,
	});
	positionIndex += 1;

	for (let i = 0; i < formation.defenders; i++) {
		const defender = formationSavedLayout.defenders.find(
			(defender) => defender.positionIndex === positionIndex,
		);
		formationDraftLayout.defenders.push({
			positionIndex,
			position: Position.Defender,
			player: defender?.player,
		});
		positionIndex += 1;
	}

	for (let i = 0; i < formation.midfielders; i++) {
		const midfielder = formationSavedLayout.midFielders.find(
			(midfielder) => midfielder.positionIndex === positionIndex,
		);
		formationDraftLayout.midFielders.push({
			positionIndex,
			position: Position.Defender,
			player: midfielder?.player,
		});
		positionIndex += 1;
	}

	for (let i = 0; i < formation.forwards; i++) {
		const forward = formationSavedLayout.forwards.find(
			(forward) => forward.positionIndex === positionIndex,
		);
		formationDraftLayout.forwards.push({
			positionIndex,
			position: Position.Defender,
			player: forward?.player,
		});
		positionIndex += 1;
	}

	return formationDraftLayout;
};

const Formation = () => {
	const { data: userData } = useGetMe();
	const [team, setTeam] = useState<ITeam | null>(null);
	const [rosterPlayers, setRosterPlayers] = useState<IPlayer[]>([]);
	const [selectedFormation, setSelectedFormation] =
		useState<IFormationStructure>(formationsStructure[0]);
	const [selectedSavedFormation, setSelectedSavedFormation] =
		useState<IFormation | null>(null);
	const [formations, setFormations] = useState<IFormation[]>([]);
	const [selectedSpot, setSelectedSpot] = useState<IFormationSpot | null>(null);
	const [formationLayout, setFormationLayout] = useState<IFormationLayout>({
		goalkeeper: [],
		defenders: [],
		midFielders: [],
		forwards: [],
	});

	const handleSaveFormation = async () => {
		const { goalkeeper, midFielders, defenders, forwards } = formationLayout;
		const formationPlayers = [
			...goalkeeper,
			...defenders,
			...midFielders,
			...forwards,
		];
		const createFormation: ICreateFormation = {
			name: 'Tacos',
			description: 'The best tacos in the world food',
			formationPlayers: formationPlayers.map(
				({ position, positionIndex: order, player }) => ({
					position,
					playerUuid: player?.uuid ?? '',
					positionIndex: order,
				}),
			),
			defenders: selectedFormation.defenders,
			forwards: selectedFormation.forwards,
			midfielders: selectedFormation.midFielders,
			rosterUuid: team?.rosterId ?? '',
		};

		const formation = await formationService.saveFormation(createFormation);
		console.log(formation, 'formation');
		notificationService.success(
			`${createFormation.defenders}-${createFormation.midfielders}-${createFormation.forwards} formation named ${createFormation.name} was successfully created. `,
		);
		setFormations((prev) => [...prev, formation.data.attributes]);
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
					console.log(data, 'data');
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
		setFormationLayout(calculatePlayerPositions(selectedFormation));
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
				midFielders: updateLine(prev.midFielders),
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
				midFielders: updateLine(prev.midFielders),
				forwards: updateLine(prev.forwards),
			};
		});

		setRosterPlayers((prev) => [...prev, formationSpot.player as IPlayer]);
	};
	console.log(formationLayout, 'formationLayout');

	const handleFormationChange = (evt: ChangeEvent<HTMLSelectElement>) => {
		const formationId = parseInt(evt.target.value);
		const formation = formationsStructure.find((f) => f.id === formationId);
		if (formation) {
			setSelectedFormation(formation);
		}
	};

	const handleSavedFormationChange = async (
		evt: ChangeEvent<HTMLSelectElement>,
	) => {
		const { value } = evt.target;
		const formation = await formationService.getFormationByUuid(value);
		formation.data.attributes.defenders;
		formation.data.attributes.midfielders;
		formation.data.attributes.forwards;
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
				midFielders: mappedFormation.Midfielder,
				forwards: mappedFormation.Forward,
			};
			setFormationLayout(
				calculatePlayerSavedPositions(
					formation.data.attributes,
					draftFormation,
				),
			);
			setRosterPlayers((prev) =>
				prev.filter((player) => !playersUuIds.includes(player.uuid)),
			);
		}
	};
	console.log(selectedSpot);
	return (
		<div className="flex flex-col gap-6 justify-center items-center min-h-screen bg-green-800 p-4">
			<h1 className="text-white text-2xl font-bold">
				Tactical Formation: {selectedFormation.name}
			</h1>
			<label htmlFor="formation" className="block text-white font-medium mb-2">
				Select formation:
			</label>
			<div className="flex flex-row gap-4">
				<select
					id="formation"
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					value={selectedFormation.id}
					onChange={handleFormationChange}
				>
					{formationsStructure.map((formation) => (
						<option key={formation.id} value={formation.id}>
							{formation.name} ({formation.defenders}-{formation.midFielders}-
							{formation.forwards})
						</option>
					))}
				</select>
				<select
					id="formation"
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					onChange={handleSavedFormationChange}
				>
					<option value="Select one formation">Select one formation</option>
					{formations.map((formation) => (
						<option key={formation.uuid} value={formation.uuid}>
							{formation.name} ({formation.defenders}-{formation.midfielders}-
							{formation.forwards})
						</option>
					))}
				</select>
				<button
					onClick={() => handleSaveFormation()}
					className="bg-white w-28 h-10 text-black rounded-sm"
				>
					Save Formation
				</button>
			</div>

			<FootballField
				players={formationLayout}
				handleRemovePlayerFromFormationLayout={
					handleRemovePlayerFromFormationLayout
				}
				handleSelectSpot={handleSelectSpot}
			/>

			<div className="bg-white p-4 rounded-lg shadow-lg">
				<div className="flex w-full flex-col items-start p-4">
					<h2 className="text-3xl font-bold text-center">Players: </h2>
					<section className="grid grid-cols-2 flex-wrap gap-2 h-40 overflow-scroll">
						{rosterPlayers?.length ? (
							rosterPlayers.map((player) => (
								<div
									key={player.id}
									className="flex items-flex-start justify-between  pt-3 group relative"
								>
									<button className="cursor-pointer"></button>
									<PlayerFormationCard
										player={player}
										handleClick={() => {
											if (selectedSpot) {
												handleUpdateFormationSpotInLayout(selectedSpot, player);
											}
										}}
									/>
								</div>
							))
						) : (
							<span className="font-semibold" data-test="team-players">
								No players
							</span>
						)}
					</section>
				</div>
			</div>
		</div>
	);
};

export default Formation;
