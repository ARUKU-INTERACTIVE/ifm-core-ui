import { Link } from 'react-router-dom';

type PropTypes = {
	to: string;
	innerText: string;
};
export default function Button({ to, innerText, ...props }: PropTypes) {
	return (
		<Link
			to={to}
			className="flex items-center justify-center rounded-full bg-blue-600 font-bold text-white m-2 px-2 shadow w-24 h-8 hover:bg-blue-500"
			{...props}
		>
			<p className="pointer-events-none">{innerText}</p>
		</Link>
	);
}
