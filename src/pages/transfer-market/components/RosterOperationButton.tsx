interface IRosterOperationButtonProps {
	readonly label: string;
	readonly onClick: () => void;
	readonly isLoading: boolean;
	readonly disabled: boolean;
	readonly type: 'add' | 'remove';
}

export const RosterOperationButton = ({
	label,
	onClick,
	isLoading,
	disabled,
	type,
}: IRosterOperationButtonProps) => {
	return (
		<button
			className={`bg-${
				type === 'add' ? 'blue' : 'red'
			}-500 text-white p-2 my-3 rounded-full w-full h-10 ${
				isLoading ? 'opacity-50' : ''
			}`}
			onClick={onClick}
			disabled={disabled}
			data-test={`${type}-roster-operation-button`}
		>
			{label}
		</button>
	);
};
