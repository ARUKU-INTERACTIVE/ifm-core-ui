import {
	CONNECT_WALLET_MESSAGE,
	SIGN_IN_SUCCESS_MESSAGE,
	TRANSACTION_SIGNED_MESSAGE,
} from '@context/auth-messages';

describe('Formation Page', () => {
	const simpleSignerUrl = Cypress.env('VITE_SIMPLE_SIGNER_URL');
	const walletAddress =
		'GCIFA5TO3C43J24C46MKPZEELRPOG3WKPUCTZX3JRLNG2IPHAECRXUY5';

	beforeEach(() => {
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
						'AAAAAGrj5kK0Xb3d3c3NvZ2Z3YXJpZ2F0ZQAAAAAAAAAAABiGAAAAQAAAAAEAAAAAAAAAZQ==',
				},
			},
			origin: simpleSignerUrl,
		});

		cy.window().then((win) => {
			win.dispatchEvent(signEvent);
		});

		cy.getBySel('toast-container').contains(TRANSACTION_SIGNED_MESSAGE);
		cy.getBySel('toast-container').contains(SIGN_IN_SUCCESS_MESSAGE);

		cy.visit('/formation');
	});

	it('should render the formation page', () => {
		cy.interceptApi(
			'/user/me',
			{ method: 'GET' },
			{ fixture: 'user/my-team-user.json' },
		);
		cy.interceptApi(
			'/team/1',
			{ method: 'GET' },
			{ fixture: 'team/team-with-roster-response' },
		);
		cy.interceptApi(
			'/roster/1?include%5Bfields%5D=players',
			{ method: 'GET' },
			{ fixture: 'roster/roster-with-team-players-response.json' },
		);
		cy.interceptApi(
			'/formation?filter%5BrosterUuid%5D=1',
			{ method: 'GET' },
			{ fixture: 'formation/formations-response.json' },
		);

		cy.getBySel('formation-title').should('contain', 'Tactical Formation');
		cy.getBySel('formation-select').should('be.visible');
		cy.getBySel('saved-formations-select').should('be.visible');
		cy.getBySel('save-formation-form').should('be.visible');

		cy.getBySel('football-field').should('be.visible');
		cy.getBySel('player-position').should('be.visible').and('have.length', 11);

		cy.getBySel('formation-players-list').should('be.visible');
		cy.getBySel('player-formation-card')
			.should('be.visible')
			.and('have.length', 11);
	});
});
