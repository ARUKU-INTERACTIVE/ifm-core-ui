import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { IPlayer } from '@/interfaces/player/IPlayer';

interface IPlayerFormationCardProps {
	player: IPlayer;
	handleClick: () => void;
}

const PlayerFormationCard = ({
	player,
	handleClick,
}: IPlayerFormationCardProps) => {
	return (
		<button
			className="flex flex-row gap-2 bg-white rounded-md border-gray-500 border-solid border justify-start items-center w-full h-[50px] max-w-[275px] p-1"
			onClick={handleClick}
			data-test="player-formation-card"
		>
			<ImageWithFallback
				src={player.imageUri}
				alt="NFT Player Image"
				className="w-full h-full object-cover rounded-full"
				wrapperClassName="w-10 h-10 bg-gray-200 relative z-0"
				fallbackClassName="w-full h-full bg-gray-600 flex justify-center items-center z-0"
			/>
			<span className="text-gray-500">{player.name}</span>
		</button>
	);
};

export default PlayerFormationCard;
