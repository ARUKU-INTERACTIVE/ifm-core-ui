import { IFormation } from '@/interfaces/formation/IFormation.interface';

export type IFormationSubset = Pick<
	IFormation,
	'id' | 'name' | 'defenders' | 'midfielders' | 'forwards'
>;
