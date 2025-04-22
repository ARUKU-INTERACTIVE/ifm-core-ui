import clsx from 'clsx';
import { FC } from 'react';

export interface IShowFilePreviewProps {
	title?: string;
	previewUrl: string;
	height?: string;
	className?: string;
}

export const ShowFilePreview: FC<IShowFilePreviewProps> = ({
	title,
	previewUrl,
	height = '300px',
	className,
}) => {
	return (
		<div
			className={clsx(
				'pb-3 d-flex justify-content-center align-items-center',
				className,
			)}
		>
			<embed
				src={previewUrl + '#navpanes=0'}
				title={title}
				width="100%"
				height={height}
			/>
		</div>
	);
};
