import { ISingleResponse } from '../api/IApiBaseResponse';
import { ICreateTeamParams } from '../team/ICreateTeam';
import { ITeam } from '../team/ITeam';

export interface ITeamService {
	createTeam(
		createTeamParams: ICreateTeamParams,
	): Promise<ISingleResponse<ITeam>>;
	getTeamById(id: number): Promise<ISingleResponse<ITeam>>;
}
