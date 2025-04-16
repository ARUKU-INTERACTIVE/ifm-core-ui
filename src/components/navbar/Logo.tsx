import { Link } from 'react-router-dom';

import logo from '../../assets/ifm.png';

type PropTypes = {
	width: number;
	height: number;
};
export default function Logo({ width, height }: PropTypes) {
	return (
		<Link to="/">
			<img src={logo} width={width} height={height} alt="Bigger Logo" />
		</Link>
	);
}
