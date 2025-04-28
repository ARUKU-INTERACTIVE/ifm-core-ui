import { IFormationPlayerPartial } from '../interfaces/IFormationPlayers';

export enum PlayerPositionColor {
	YELLOW = '#FFD700',
	BLUE = '#1E90FF',
	RED = '#FF4500',
	GREEN = '#4CAF50',
	NON_SELECTED = '#808080',
}

interface IPlayerPositionProps {
	formationPlayer: IFormationPlayerPartial;
	backgroundColor: PlayerPositionColor;
	handleSelectSpot: () => void;
	handleRemovePlayerFromSpot: () => void;
	isPositionSelected: boolean;
	dataTest: string;
}

const PlayerPosition = ({
	formationPlayer,
	backgroundColor,
	handleSelectSpot,
	handleRemovePlayerFromSpot,
	isPositionSelected,
	dataTest,
}: IPlayerPositionProps) => {
	const { player } = formationPlayer;
	const playerInitials = player?.name
		.split(' ')
		.map((word) => word.charAt(0).toUpperCase())
		.join('');
	return (
		<div
			className="relative w-full h-6 flex items-center justify-center text-white text-xs font-bold"
			data-test="player-position"
		>
			{player && (
				<button
					type="button"
					className="cursor-pointer text-xs text-red-600 absolute bottom-[100%] right-4"
					onClick={() => handleRemovePlayerFromSpot()}
				>
					x
				</button>
			)}
			<button
				type="button"
				onClick={() => handleSelectSpot()}
				className={`cursor-pointer w-8 h-8 rounded-full border-2 ${
					isPositionSelected ? 'border-orange-500' : 'border-white'
				}`}
				style={{
					backgroundColor: player
						? backgroundColor
						: PlayerPositionColor.NON_SELECTED,
					borderColor: isPositionSelected ? backgroundColor : 'white',
				}}
				data-test={dataTest}
			>
				{playerInitials}
			</button>
		</div>
	);
};

export default PlayerPosition;
