import { IListResponse } from '../api/IApiBaseResponse';
import { IPlayer } from '../player/IPlayer';

export interface IPlayerService {
	getAll(name: string, isInAuction: boolean): Promise<IListResponse<IPlayer>>;
}
