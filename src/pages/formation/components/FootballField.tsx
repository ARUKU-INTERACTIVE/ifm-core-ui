import { IFormationSpot } from '../interfaces/coordinates.interface';
import { IFormationLayout } from '../interfaces/formation-players.interface';

import { IPlayer } from '@/interfaces/player/IPlayer';

enum PlayerPositionColor {
	YELLOW = '#FFD700',
	BLUE = '#1E90FF',
	RED = '#FF4500',
	GREEN = '#4CAF50',
}

interface IPlayerProps {
	formationSpot: IFormationSpot;
	backgroundColor: PlayerPositionColor;
	handleSelectSpot: () => void;
	handleRemovePlayerFromSpot: () => void;
}

const PlayerPosition = ({
	formationSpot,
	backgroundColor,
	handleSelectSpot,
	handleRemovePlayerFromSpot,
}: IPlayerProps) => {
	const { player } = formationSpot;
	console.log(player, 'player');
	return (
		<div className="relative w-full h-6 flex items-center justify-center text-white text-xs font-bold">
			{player && (
				<button
					className="cursor-pointer text-xs text-red-600 absolute bottom-[100%] right-0"
					onClick={() => handleRemovePlayerFromSpot()}
				>
					x
				</button>
			)}
			<div
				onClick={() => handleSelectSpot()}
				className="cursor-pointer w-6 h-6 rounded-full border-2 border-white "
				style={{
					backgroundColor: backgroundColor,
				}}
			></div>

			{player && (
				<span className="absolute top-6 w-24 text-center block text-black">
					{player.name}
				</span>
			)}
		</div>
	);
};

interface IFootballFieldProps {
	players: IFormationLayout;
	handleSelectSpot: (playerCoordinates: IFormationSpot) => void;
	handleRemovePlayerFromFormationLayout: (
		formationSpot: IFormationSpot,
	) => void;
}

// Componente del Campo de Fútbol
const FootballField = ({
	players,
	handleSelectSpot,
	handleRemovePlayerFromFormationLayout,
}: IFootballFieldProps) => {
	console.log(players.defenders, 'defenders');
	return (
		<div className="relative w-full max-w-lg h-64 bg-green-700 border-4 border-white">
			{/* Línea de medio campo */}
			<div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white transform -translate-x-1/2" />

			{/* Círculo central */}
			<div className="absolute w-16 h-16 border-2 border-white rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />

			{/* Áreas */}
			<div className="absolute left-0 top-1/2 w-20 h-32 border-2 border-white transform -translate-y-1/2" />
			<div className="absolute right-0 top-1/2 w-20 h-32 border-2 border-white transform -translate-y-1/2" />

			{/* Arcos */}
			<div className="absolute left-0 top-1/2 w-4 h-16 border-2 border-l-0 border-white transform -translate-y-1/2" />
			<div className="absolute right-0 top-1/2 w-4 h-16 border-2 border-r-0 border-white transform -translate-y-1/2" />

			{/* Puntos de penal
			<div className="absolute w-1.5 h-1.5 bg-white rounded-full left-16 top-1/2 transform -translate-y-1/2" />
			<div className="absolute w-1.5 h-1.5 bg-white rounded-full right-16 top-1/2 transform -translate-y-1/2" />
			 */}

			{/* Renderiza portero */}
			<div className="flex flex-row h-full">
				<div className="flex flex-1 justify-start items-center">
					{players.goalkeeper.map((formationSpot, idx) => (
						<PlayerPosition
							key={`goal-${idx}`}
							formationSpot={formationSpot}
							backgroundColor={PlayerPositionColor.YELLOW}
							handleSelectSpot={() => {
								handleSelectSpot(formationSpot);
							}}
							handleRemovePlayerFromSpot={() => {
								handleRemovePlayerFromFormationLayout(formationSpot);
							}}
						/>
					))}
				</div>
				{/* Renderiza jugadores de campo */}
				<div className="flex flex-col h-full justify-center items-center gap-6 flex-1">
					{players.defenders.map((formationSpot, idx) => (
						<PlayerPosition
							handleSelectSpot={() => {
								handleSelectSpot(formationSpot);
							}}
							handleRemovePlayerFromSpot={() => {
								handleRemovePlayerFromFormationLayout(formationSpot);
							}}
							key={`def-${idx}`}
							formationSpot={formationSpot}
							backgroundColor={PlayerPositionColor.BLUE}
						/>
					))}
				</div>

				<div className="flex flex-col h-full justify-center items-center gap-6 flex-1" />
				<div className="flex flex-col h-full justify-center items-center gap-6 flex-1">
					{players.midFielders.map((formationSpot, idx) => (
						<PlayerPosition
							handleSelectSpot={() => {
								handleSelectSpot(formationSpot);
							}}
							handleRemovePlayerFromSpot={() => {
								handleRemovePlayerFromFormationLayout(formationSpot);
							}}
							key={`mid-${idx}`}
							formationSpot={formationSpot}
							backgroundColor={PlayerPositionColor.GREEN}
						/>
					))}
				</div>
				<div className="flex flex-col h-full justify-center items-start gap-6 flex-1" />
				<div className="flex flex-col h-full justify-center items-center gap-6 flex-1">
					{players.forwards.map((formationSpot, idx) => (
						<PlayerPosition
							handleSelectSpot={() => {
								handleSelectSpot(formationSpot);
							}}
							handleRemovePlayerFromSpot={() => {
								handleRemovePlayerFromFormationLayout(formationSpot);
							}}
							key={`fwd-${idx}`}
							formationSpot={formationSpot}
							backgroundColor={PlayerPositionColor.RED}
						/>
					))}
				</div>
				<div className="flex flex-col h-full justify-center items-center gap-6 flex-1" />
			</div>
		</div>
	);
};

export default FootballField;
