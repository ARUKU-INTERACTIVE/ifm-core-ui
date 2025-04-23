export interface IBaseEntity {
	id: number;
	uuid?: string;
	createdAt: string;
	updatedAt: string;
	deletedAt?: string;
}
