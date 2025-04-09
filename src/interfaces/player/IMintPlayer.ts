import { ITransactionNFTData } from './ITransactionNFT';

export interface IMintPlayerParams {
	file: File;
	name: string;
	description: string;
}

export interface ISubmitMintPlayerParams extends ITransactionNFTData {
	name: string;
	description: string;
}
