import { Link } from 'react-router-dom';

import logo from '../../assets/ifm.png';

interface ILogoProps {
	width: number;
	height: number;
}

export default function Logo({ width, height }: ILogoProps) {
	return (
		<Link to="/">
			<img src={logo} width={width} height={height} alt="IFM Logo" />
		</Link>
	);
}
