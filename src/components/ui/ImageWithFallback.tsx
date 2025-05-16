import { useState } from 'react';

interface IImageWithFallbackProps {
	src?: string;
	alt?: string;
	className?: string;
	wrapperClassName?: string;
	skeletonClassName?: string;
	fallbackClassName?: string;
	rounded?: 'sm' | 'md' | 'lg';
}

export const ImageWithFallback = ({
	src,
	alt = 'image',
	className,
	wrapperClassName,
	skeletonClassName,
	fallbackClassName,
	rounded = 'lg',
}: IImageWithFallbackProps) => {
	const [isLoaded, setIsLoaded] = useState(false);
	const [hasError, setHasError] = useState(false);

	const shouldShowSkeleton = src && !isLoaded && !hasError;
	const shouldShowImage = src && !hasError;

	return (
		<div className={`relative z-0 ${wrapperClassName}`}>
			{shouldShowSkeleton && (
				<div
					className={`absolute inset-0 animate-pulse bg-gray-400 rounded-${rounded} ${skeletonClassName}`}
				/>
			)}

			{shouldShowImage ? (
				<img
					src={src}
					alt={alt}
					loading="lazy"
					onLoad={() => setIsLoaded(true)}
					onError={() => setHasError(true)}
					className={`transition-opacity duration-300 object-cover rounded-${rounded} ${className} ${
						isLoaded ? 'opacity-100' : 'opacity-0'
					}`}
				/>
			) : (
				<div
					className={`bg-gray-600 flex justify-center items-center text-white text-center rounded-${rounded} ${fallbackClassName}`}
				>
					<p>{hasError ? 'Error loading image' : 'No image'}</p>
				</div>
			)}
		</div>
	);
};
