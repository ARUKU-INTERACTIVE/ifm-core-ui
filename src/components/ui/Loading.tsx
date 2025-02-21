import React from 'react';

const Loading: React.FC = () => {
	return (
		<div className="p-6" data-test="loading-spinner">
			<div className="flex items-center justify-center">
				<div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
			</div>
		</div>
	);
};

export default Loading;
