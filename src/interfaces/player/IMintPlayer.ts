import { ITransactionNFTData } from './ITransactionNFT';

interface IMintPlayer {
	name: string;
	description: string;
}
export interface IMintPlayerParams extends IMintPlayer {
	file: File | null;
}

export interface IMintPlayerFormValues extends IMintPlayer {
	file: FileList | null;
}

export interface ISubmitMintPlayerParams extends ITransactionNFTData {
	name: string;
	description: string;
}
