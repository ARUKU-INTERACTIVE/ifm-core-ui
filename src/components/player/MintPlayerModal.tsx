import MintPlayerForm from './MintPlayerForm';

interface IMintPlayerModalProps {
	isOpen: boolean;
	onHide: () => void;
}

const MintPlayerModal = ({ isOpen, onHide }: IMintPlayerModalProps) => {
	if (!isOpen) {
		return null;
	}

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
			<div className="bg-white p-6 rounded-md w-[80%] max-w-md">
				<h2
					className="text-2xl font-bold text-center mb-4"
					data-test="mint-player-modal-title"
				>
					Mint Player
				</h2>
				<MintPlayerForm onHide={onHide} />
			</div>
		</div>
	);
};

export default MintPlayerModal;
