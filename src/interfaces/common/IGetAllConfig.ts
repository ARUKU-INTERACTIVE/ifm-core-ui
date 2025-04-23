export interface IGetAllConfig<T> {
	filters?: T;
	page?: { number: number; size: number };
}
