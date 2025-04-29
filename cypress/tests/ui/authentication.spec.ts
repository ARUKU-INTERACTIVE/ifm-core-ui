import {
	CONNECT_WALLET_ERROR,
	CONNECT_WALLET_MESSAGE,
	SIGN_TRANSACTION_ERROR,
} from '@context/auth-messages';

describe('/auth', () => {
	const walletAddress =
		'GCTIUQVU4GWDINAEC3B2E2PMVTW45YQ5MMHKQI737YHCVP6UI4ET4G2R';
	const simpleSignerUrl = Cypress.env('VITE_SIMPLE_SIGNER_URL');

	describe('/', () => {
		beforeEach(() => {
			cy.visit('/');
		});
		it('Should be able to connect your wallet and sign in with transaction', () => {
			cy.signInWithWallet(simpleSignerUrl, walletAddress);
		});

		it('should show an error if the wallet is not connected', () => {
			cy.window().then((window) => {
				cy.stub(window, 'open')
					.as('connect-wallet')
					.callsFake(() => null);
			});

			cy.getBySel('sign-in-btn').should('have.text', 'Connect Wallet').click();
			cy.getBySel('connect-wallet-button').click();

			const connectCancelEvent = new MessageEvent('message', {
				data: {
					type: 'onCancel',
					page: `${simpleSignerUrl}/connect`,
					message: 'The user has canceled the operation',
				},
				origin: simpleSignerUrl,
			});

			cy.window().then((win) => {
				win.dispatchEvent(connectCancelEvent);
			});

			cy.getBySel('toast-container').contains(CONNECT_WALLET_ERROR);
		});

		it('Should show an error if the transaction failed', () => {
			cy.interceptApi(
				`/auth/challenge?publicKey=${walletAddress}`,
				{ method: 'GET' },
				{ fixture: 'auth/challenge-transaction-response.json' },
			).as('get-challenge');

			cy.window().then((window) => {
				cy.stub(window, 'open')
					.as('connect-wallet')
					.callsFake(() => null);
			});

			cy.getBySel('sign-in-btn').should('have.text', 'Connect Wallet').click();
			cy.getBySel('connect-wallet-button').click();

			const connectEvent = new MessageEvent('message', {
				data: {
					type: 'onConnect',
					page: `${simpleSignerUrl}/connect`,
					message: {
						publicKey: walletAddress,
						wallet: 'albedo',
					},
				},
				origin: simpleSignerUrl,
			});

			cy.window().then((win) => {
				win.dispatchEvent(connectEvent);
			});

			cy.getBySel('toast-container').contains(CONNECT_WALLET_MESSAGE);

			cy.wait(2000);
			cy.getBySel('sign-in-btn').should('have.text', 'Sign In');
			cy.getBySel('sign-in-with-transaction-button').click();
			cy.wait('@get-challenge');

			const signCancelEvent = new MessageEvent('message', {
				data: {
					type: 'onCancel',
					page: `${simpleSignerUrl}/sign`,
					message: 'The user has canceled the operation',
				},
				origin: simpleSignerUrl,
			});

			cy.window().then((win) => {
				win.dispatchEvent(signCancelEvent);
			});

			cy.getBySel('toast-container').contains(SIGN_TRANSACTION_ERROR);
		});
	});
});
