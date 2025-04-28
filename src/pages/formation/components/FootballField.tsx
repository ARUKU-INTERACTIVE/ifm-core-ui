import {
	IFormationLayout,
	IFormationPlayerPartial,
} from '../interfaces/IFormationPlayers';
import PlayerPosition, { PlayerPositionColor } from './PlayerPosition';

interface IFootballFieldProps {
	players: IFormationLayout;
	handleSelectSpot: (selectedSpot: IFormationPlayerPartial) => void;
	handleRemovePlayerFromFormationLayout: (
		formationPlayer: IFormationPlayerPartial,
	) => void;
	selectedSpot: IFormationPlayerPartial | null;
}
interface IGoalAreaProps {
	isRight?: boolean;
}
const GoalArea = ({ isRight }: IGoalAreaProps) => {
	return (
		<div
			className={`flex flex-row items-center justify-between border-4 border-l-0 w-20 h-32 border-white ${
				isRight && 'transform rotate-180'
			}`}
		>
			<div className="border-4 border-l-0 w-8 h-14 border-white" />
			<div className="rounded-[0_100px_100px_0] border-4 border-l-0 w-8 h-14 border-white translate-x-8" />
		</div>
	);
};

const CenterSpot = () => {
	return (
		<div className="h-full w-1 bg-white flex justify-center items-center">
			<div className="w-16 h-16 absolute rounded-full border-4 border-white" />
		</div>
	);
};

const FootballField = ({
	players,
	handleSelectSpot,
	handleRemovePlayerFromFormationLayout,
	selectedSpot,
}: IFootballFieldProps) => {
	return (
		<div className="bg-green-700 flex justify-center w-full p-4 rounded-md">
			<div
				className="relative w-full max-w-lg h-72 border-4 border-white"
				data-test="football-field"
			>
				<div className="absolute top-0 flex flex-row justify-between w-full h-full items-center">
					<GoalArea />
					<CenterSpot />
					<GoalArea isRight />
				</div>

				<div className="flex flex-row h-full">
					<div className="flex flex-1 justify-start items-center">
						{players.goalkeeper.map((formationPlayer, idx) => (
							<PlayerPosition
								key={`goal-${idx}`}
								dataTest={`goalkeeper-position-spot-${idx}`}
								formationPlayer={formationPlayer}
								backgroundColor={PlayerPositionColor.YELLOW}
								handleSelectSpot={() => {
									handleSelectSpot(formationPlayer);
								}}
								handleRemovePlayerFromSpot={() => {
									handleRemovePlayerFromFormationLayout(formationPlayer);
								}}
								isPositionSelected={selectedSpot === formationPlayer}
							/>
						))}
					</div>
					<div className="flex flex-col h-full justify-center items-center gap-6 flex-1">
						{players.defenders.map((formationPlayer, idx) => (
							<PlayerPosition
								handleSelectSpot={() => {
									handleSelectSpot(formationPlayer);
								}}
								handleRemovePlayerFromSpot={() => {
									handleRemovePlayerFromFormationLayout(formationPlayer);
								}}
								dataTest={`defender-position-spot-${idx}`}
								key={`def-${idx}`}
								formationPlayer={formationPlayer}
								backgroundColor={PlayerPositionColor.BLUE}
								isPositionSelected={selectedSpot === formationPlayer}
							/>
						))}
					</div>

					<div className="flex flex-col h-full justify-center items-center gap-6 flex-1" />
					<div className="flex flex-col h-full justify-center items-center gap-6 flex-1">
						{players.midfielders.map((formationPlayer, idx) => (
							<PlayerPosition
								handleSelectSpot={() => {
									handleSelectSpot(formationPlayer);
								}}
								handleRemovePlayerFromSpot={() => {
									handleRemovePlayerFromFormationLayout(formationPlayer);
								}}
								dataTest={`midfielder-position-spot-${idx}`}
								key={`mid-${idx}`}
								formationPlayer={formationPlayer}
								backgroundColor={PlayerPositionColor.GREEN}
								isPositionSelected={selectedSpot === formationPlayer}
							/>
						))}
					</div>
					<div className="flex flex-col h-full justify-center items-start gap-6 flex-1" />
					<div className="flex flex-col h-full justify-center items-center gap-6 flex-1">
						{players.forwards.map((formationPlayer, idx) => (
							<PlayerPosition
								handleSelectSpot={() => {
									handleSelectSpot(formationPlayer);
								}}
								handleRemovePlayerFromSpot={() => {
									handleRemovePlayerFromFormationLayout(formationPlayer);
								}}
								dataTest={`forward-position-spot-${idx}`}
								key={`fwd-${idx}`}
								formationPlayer={formationPlayer}
								backgroundColor={PlayerPositionColor.RED}
								isPositionSelected={selectedSpot === formationPlayer}
							/>
						))}
					</div>
					<div className="flex flex-col h-full justify-center items-center gap-6 flex-1" />
				</div>
			</div>
		</div>
	);
};

export default FootballField;
