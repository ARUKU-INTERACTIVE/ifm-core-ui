import React from 'react';

import { IExampleUser } from '../types/user.types';
import { User } from './User';

interface UsersListProps {
	users: IExampleUser[];
}

export const UsersList: React.FC<UsersListProps> = ({ users }) => {
	return (
		<div
			className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
			data-test="users-list"
		>
			{users.map((user) => (
				<User key={user.id} user={user} />
			))}
		</div>
	);
};
