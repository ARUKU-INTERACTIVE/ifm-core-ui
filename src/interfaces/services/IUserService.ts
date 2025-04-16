import { ISingleResponse } from '../api/IApiBaseResponse';
import { IUser } from '../api/IUser';

export interface IUserService {
	getMe(): Promise<ISingleResponse<IUser>>;
}
