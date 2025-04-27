import { useState } from 'react';

import { IPlayer } from '@/interfaces/player/IPlayer';

interface IPlayerFormationCardProps {
	player: IPlayer;
	handleClick: () => void;
}

const PlayerFormationCard = ({
	player,
	handleClick,
}: IPlayerFormationCardProps) => {
	const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);

	return (
		<button
			className="flex flex-row gap-2 bg-white rounded-md border-gray-500 border-solid border justify-start items-center w-full h-[50px] max-w-[275px] p-1"
			onClick={handleClick}
			data-test="player-formation-card"
		>
			<div className="w-10 h-10 rounded-full bg-gray-200 relative z-0">
				{player.imageUri && !isImageLoaded && (
					<div className="w-full max-h-10 h-full absolute inset-0 animate-pulse bg-gray-400 rounded-full" />
				)}
				{player.imageUri ? (
					<img
						loading="lazy"
						alt="NFT Player"
						src={player.imageUri}
						className={`w-10 h-10 object-cover rounded-full ${
							isImageLoaded ? 'opacity-100' : 'opacity-0'
						}`}
						onLoad={() => {
							setIsImageLoaded(true);
						}}
					/>
				) : (
					<div className="w-full h-full bg-gray-600 flex justify-center rounded-lg items-center z-0">
						<p className="text-white text-center">No image</p>
					</div>
				)}
			</div>
			<span className="text-gray-500">{player.name}</span>
		</button>
	);
};

export default PlayerFormationCard;
