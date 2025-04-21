import {
	Asset,
	Horizon,
	Operation,
	TransactionBuilder,
} from '@stellar/stellar-sdk';

import { ApiRequestConfig, apiService } from './api.service';

import { IApiService } from '@/interfaces/services/IApiService';
import { IStellarService } from '@/interfaces/services/IStellarService';

import {
	STELLAR_HORIZON_URL,
	STELLAR_NETWORK_PASSPHRASE,
} from '@configs/environment';

class StellarService implements IStellarService {
	api: IApiService<ApiRequestConfig>;
	private readonly server: Horizon.Server;

	constructor(api: IApiService<ApiRequestConfig>) {
		this.server = new Horizon.Server(STELLAR_HORIZON_URL);
		this.api = api;
	}

	async createAddTrustlineTransactionXDR(
		accountAddress: string,
		tokenIssuer: string,
		tokenCode: string,
	): Promise<string> {
		const account = await this.server.loadAccount(accountAddress);

		const transaction = new TransactionBuilder(account, {
			fee: (await this.server.fetchBaseFee()).toString(),
			networkPassphrase: STELLAR_NETWORK_PASSPHRASE,
		})
			.addOperation(
				Operation.changeTrust({
					asset: new Asset(tokenCode, tokenIssuer),
				}),
			)
			.setTimeout(180);

		return transaction.build().toXDR();
	}

	async submitTransactionXDR(xdr: string): Promise<void> {
		const transaction = TransactionBuilder.fromXDR(xdr, 'base64');
		await this.server.submitTransaction(transaction);
	}
}

export const stellarService = new StellarService(apiService);
