import React from 'react';

import { IExampleUser } from '../types/user.types';

interface UserProps {
	user: IExampleUser;
}

export const User: React.FC<UserProps> = ({ user }) => {
	return (
		<div
			className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
			data-test="user-card"
		>
			<h3 className="text-xl font-semibold text-gray-800 mb-3">{user.name}</h3>
			<p className="text-gray-600 mb-2">
				<span className="font-medium">Username:</span> {user.username}
			</p>
			<p className="text-gray-600">
				<span className="font-medium">Email:</span> {user.email}
			</p>
		</div>
	);
};
