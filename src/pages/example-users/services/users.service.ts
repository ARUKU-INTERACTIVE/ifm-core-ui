import axios from 'axios';

import { IExampleUser } from '../types/user.types';

const PLACEHOLDER_API_URL = 'https://jsonplaceholder.typicode.com';

class UsersService {
	async getUsers(): Promise<IExampleUser[]> {
		const response = await axios.get<IExampleUser[]>(
			`${PLACEHOLDER_API_URL}/users`,
		);
		return response.data;
	}
}

export const usersService = new UsersService();
