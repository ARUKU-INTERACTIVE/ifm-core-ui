import {
	CONNECT_WALLET_ERROR,
	CONNECT_WALLET_MESSAGE,
	SIGN_IN_SUCCESS_MESSAGE,
	SIGN_TRANSACTION_ERROR,
	TRANSACTION_SIGNED_MESSAGE,
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
			cy.interceptApi(
				`/auth/challenge?publicKey=${walletAddress}`,
				{ method: 'GET' },
				{ fixture: 'auth/challenge-transaction-response.json' },
			);
			cy.interceptApi(
				'/auth/sign-in',
				{ method: 'POST' },
				{ fixture: 'auth/sign-in.json' },
			).as('sign-in');

			cy.window().then((window) => {
				cy.stub(window, 'open')
					.as('connect-wallet')
					.callsFake(() => null);
			});

			cy.getBySel('sign-in-btn').should('have.text', 'Sign In').click();
			cy.get('@connect-wallet').should('be.called');

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

			cy.wait(1000);

			const signEvent = new MessageEvent('message', {
				data: {
					type: 'onSign',
					page: `${simpleSignerUrl}/sign`,
					message: {
						signedXDR:
							'AAAAAGrj5kK0Xb3d3c3NvZ2Z3YXJpZ2F0ZQAAAAAAAAAAABiGAAAAQAAAAA=',
					},
				},
				origin: simpleSignerUrl,
			});

			cy.window().then((win) => {
				win.dispatchEvent(signEvent);
			});

			cy.getBySel('toast-container').contains(TRANSACTION_SIGNED_MESSAGE);
			cy.getBySel('toast-container').contains(SIGN_IN_SUCCESS_MESSAGE);
		});

		it('should show an error if the wallet is not connected', () => {
			cy.window().then((window) => {
				cy.stub(window, 'open')
					.as('connect-wallet')
					.callsFake(() => null);
			});

			cy.getBySel('sign-in-btn').should('have.text', 'Sign In').click();
			cy.get('@connect-wallet').should('be.called');

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
			);

			cy.window().then((window) => {
				cy.stub(window, 'open')
					.as('connect-wallet')
					.callsFake(() => null);
			});

			cy.getBySel('sign-in-btn').should('have.text', 'Sign In').click();
			cy.get('@connect-wallet').should('be.called');

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
