import React from 'react';

interface ErrorMessageProps {
	title?: string;
	message?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
	title = 'Error',
	message = 'Something went wrong',
}) => {
	return (
		<div className="p-6" data-test="error-message">
			<h1 className="text-2xl font-bold mb-6">{title}</h1>
			<div className="text-red-600">{message}</div>
		</div>
	);
};

export default ErrorMessage;
