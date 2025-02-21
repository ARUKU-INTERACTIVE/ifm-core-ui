import { Link } from 'react-router-dom';

import biggerSvg from '../../assets/bigger.svg';

type PropTypes = {
	width: number;
	height: number;
};
export default function Logo({ width, height }: PropTypes) {
	return (
		<Link to="/">
			<img
				className={`bg-black p-2`}
				src={biggerSvg}
				width={width}
				height={height}
				alt="Bigger Logo"
			/>
		</Link>
	);
}
