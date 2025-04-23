import { ISingleResponse } from '../api/IApiBaseResponse';
import { IPlayer } from '../player/IPlayer';
import { IRoster } from '../roster/IRoster';

export interface IRosterService {
	addPlayerToRoster(
		playerId: number,
		rosterId: string,
	): Promise<ISingleResponse<IPlayer>>;
	getAllPlayersFromRoster(rosterId: string): Promise<ISingleResponse<IRoster>>;
	removePlayerFromRoster(
		playerId: number,
		rosterId: string,
	): Promise<ISingleResponse<IPlayer>>;
}
