export interface IUser {
	id: number;
	publicKey?: string;
	username: string;
	teamId?: number;
	externalId: string;
	createdAt: string;
	updatedAt: string;
	deletedAt: string;
}
