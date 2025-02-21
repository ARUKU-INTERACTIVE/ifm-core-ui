import React from 'react';

import { UsersList } from './components/UsersList';
import { useUsers } from './hooks/useUsers';

import ErrorMessage from '@/components/ui/ErrorMessage';
import Loading from '@/components/ui/Loading';

const Users: React.FC = () => {
	const { data: users, isLoading, error } = useUsers();

	if (isLoading) {
		return <Loading />;
	}

	if (error) {
		return <ErrorMessage title="Users" message="Error loading users" />;
	}

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-6">Users</h1>
			<UsersList users={users || []} />
		</div>
	);
};

export default Users;
