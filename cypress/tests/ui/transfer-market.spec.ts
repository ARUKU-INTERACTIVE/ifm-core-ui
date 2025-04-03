import {
	CONNECT_WALLET_MESSAGE,
	SIGN_IN_SUCCESS_MESSAGE,
	TRANSACTION_SIGNED_MESSAGE,
} from '@context/auth-messages';

describe('Transfer Market', () => {
	beforeEach(() => {
		const simpleSignerUrl = Cypress.env('VITE_SIMPLE_SIGNER_URL');
		const walletAddress =
			'GCTIUQVU4GWDINAEC3B2E2PMVTW45YQ5MMHKQI737YHCVP6UI4ET4G2R';

		cy.visit('/');
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

		cy.visit('/transfer-market');
	});

	it('should render correctly', () => {
		cy.interceptApi(
			'/player',
			{ method: 'GET' },
			{ fixture: 'player/players-response.json' },
		);

		cy.getBySel('transfer-market-title').should('contain', 'Transfer Market');
		cy.getBySel('card').should('have.length', 3);
	});

	it('should search a player by its name', () => {
		const searchValue = 'two';
		cy.interceptApi(
			`/player?filter[name]=${searchValue}`,
			{ method: 'GET' },
			{ fixture: 'player/search-player-response.json' },
		);

		cy.getBySel('transfer-market-title').should('contain', 'Transfer Market');
		cy.getBySel('transfer-market-searchbar').type(searchValue);
		cy.wait(200);

		cy.getBySel('card')
			.should('have.length', 1)
			.and('contain.text', 'Player Two');
	});
});
