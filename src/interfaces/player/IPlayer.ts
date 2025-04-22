import { IUser } from '../api/IUser';
import { IAuction } from '../auction/IAuction';

export interface IPlayer {
	id: string;
	name: string;
	description: string;
	uuid: string;
	metadataUri: string;
	issuer: string;
	externalId: number;
	createdAt: string;
	updatedAt: string;
	deletedAt?: string;
	imageUri?: string;
	owner?: IUser;
	isInAuction?: boolean;
	auctions?: IAuction[];
	address?: string;
}
