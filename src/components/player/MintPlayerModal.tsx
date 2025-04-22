import MintPlayerForm from './MintPlayerForm';

import { IMintPlayerFormValues } from '@/interfaces/player/IMintPlayer';

interface IMintPlayerModalProps {
	isOpen: boolean;
	onHide: () => void;
	mintPlayer: (params: IMintPlayerFormValues) => Promise<void>;
	isMintPlayerPending: boolean;
	isSubmitMintPlayerPending: boolean;
}

const MintPlayerModal = ({
	isOpen,
	onHide,
	mintPlayer,
	isMintPlayerPending,
	isSubmitMintPlayerPending,
}: IMintPlayerModalProps) => {
	if (!isOpen) {
		return null;
	}

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
			<div className="bg-white p-6 rounded-md w-[80%] max-w-md">
				<h2
					className="text-2xl font-bold text-center mb-4"
					data-test="mint-player-modal-title"
				>
					Mint Player
				</h2>
				<MintPlayerForm
					onHide={onHide}
					mintPlayer={mintPlayer}
					isMintPlayerPending={isMintPlayerPending}
					isSubmitMintPlayerPending={isSubmitMintPlayerPending}
				/>
			</div>
		</div>
	);
};

export default MintPlayerModal;
