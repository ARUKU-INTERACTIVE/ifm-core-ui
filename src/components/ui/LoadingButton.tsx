const LoadingButton = () => {
	return (
		<button className="bg-blue-500 text-white font-bold rounded-full min-w-[100px]">
			<span className="material-symbols-outlined animate-spin pointer-events-none align-middle">
				progress_activity
			</span>
		</button>
	);
};

export default LoadingButton;
