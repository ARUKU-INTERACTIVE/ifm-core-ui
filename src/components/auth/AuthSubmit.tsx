type PropTypes = {
	loading?: boolean;
};
export default function AuthSubmit({ loading, ...props }: PropTypes) {
	if (loading)
		return (
			<div className="h-10 flex flex-1 justify-center items-start">
				<div className="rounded-md px-4 py-1 text-white w-full bg-blue-400 font-medium flex justify-center">
					<span className="material-symbols-outlined animate-spin pointer-events-none">
						progress_activity
					</span>
				</div>
			</div>
		);
	return (
		<div className="h-10 flex flex-1 justify-center items-start">
			<button
				type="submit"
				className="bg-blue-600 rounded-md px-4 py-1 text-white w-full hover:bg-blue-500 font-medium"
				{...props}
			>
				Submit
			</button>
		</div>
	);
}
