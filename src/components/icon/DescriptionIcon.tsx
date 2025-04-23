interface IDescriptionIconProps {
	fill?: string;
}

export const DescriptionIcon = ({ fill = 'none' }: IDescriptionIconProps) => {
	return (
		<svg viewBox="0 0 24 24" fill={fill} xmlns="http://www.w3.org/2000/svg">
			<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
			<g
				id="SVGRepo_tracerCarrier"
				strokeLinecap="round"
				strokeLinejoin="round"
			></g>
			<g id="SVGRepo_iconCarrier">
				<g clipPath="url(#clip0_429_11160)">
					<circle
						cx="12"
						cy="11.9999"
						r="9"
						stroke="#292929"
						strokeWidth="2.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					></circle>
					<rect
						x="12"
						y="8"
						width="0.01"
						height="0.01"
						stroke="#292929"
						strokeWidth="3.75"
						strokeLinejoin="round"
					></rect>
					<path
						d="M12 12V16"
						stroke="#292929"
						strokeWidth="2.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					></path>
				</g>
				<defs>
					<clipPath id="clip0_429_11160">
						<rect width="24" height="24" fill="currentColor"></rect>
					</clipPath>
				</defs>
			</g>
		</svg>
	);
};
