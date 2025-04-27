interface ISwitchButtonProps {
	isActive: boolean;
	handleSwitchToggle: () => void;
}

export default function SwitchButton({
	isActive,
	handleSwitchToggle,
}: ISwitchButtonProps) {
	return (
		<div
			className={`relative inline-flex h-6 w-12 cursor-pointer rounded-full transition-colors duration-300 ease-in-out ${
				isActive ? 'bg-green-700' : 'bg-gray-200'
			}`}
			onClick={handleSwitchToggle}
			role="switch"
			aria-checked={isActive}
			tabIndex={0}
		>
			<span
				className={`absolute left-0.5 top-0.5 flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out ${
					isActive ? 'translate-x-6' : 'translate-x-0'
				}`}
			/>
		</div>
	);
}
