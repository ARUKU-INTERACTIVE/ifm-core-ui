export interface IStellarService {
	createAddTrustlineTransactionXDR(
		accountAddress: string,
		tokenIssuer: string,
		tokenCode: string,
	): Promise<string>;
	submitTransactionXDR(xdr: string): Promise<void>;
}
