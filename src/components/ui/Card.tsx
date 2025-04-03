type Props = {
	readonly name: string;
};

export default function Card({ name }: Props) {
	return (
		<div
			className="max-w-sm rounded overflow-hidden shadow-lg"
			data-test="card"
		>
			<div className="px-6 py-4">
				<div className="font-bold text-md mb-2">{name}</div>
			</div>
		</div>
	);
}
