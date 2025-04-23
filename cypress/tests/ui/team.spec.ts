import {
	CONNECT_WALLET_MESSAGE,
	SIGN_IN_SUCCESS_MESSAGE,
	TRANSACTION_SIGNED_MESSAGE,
} from '@context/auth-messages';

import {
	CREATE_TEAM_ERROR_MESSAGE,
	CREATE_TEAM_SUCCESS_MESSAGE,
	GET_TEAM_ERROR_MESSAGE,
} from '@/constants/messages/team-messages';

describe('Team Page', () => {
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

		cy.visit('/team');
	});

	it('should render the team page', () => {
		cy.interceptApi(
			'/user/me',
			{ method: 'GET' },
			{ fixture: 'user/my-user.json' },
		);

		cy.getBySel('team-home-msg')
			.should('be.visible')
			.and('have.text', "You don't have a team yet");
		cy.getBySel('create-team-btn')
			.should('be.visible')
			.and('have.text', 'Create a new team');
	});

	it('should create a team', () => {
		cy.interceptApi(
			'/user/me',
			{ method: 'GET' },
			{ fixture: 'user/my-user.json' },
		).as('get-user');
		cy.interceptApi(
			'/team',
			{ method: 'POST' },
			{ fixture: 'team/team-response.json' },
		);
		cy.interceptApi(
			'/team/1',
			{ method: 'GET' },
			{ fixture: 'team/team-response.json' },
		);
		cy.interceptApi(
			'/player?filter%5BteamId%5D=1',
			{ method: 'GET' },
			{ fixture: 'player/team-players-response.json' },
		);
		cy.interceptApi(
			'/user/me',
			{ method: 'GET' },
			{ fixture: 'user/my-team-user.json' },
		).as('get-team-user');

		cy.wait('@get-user');

		cy.getBySel('create-team-btn').click();
		cy.getBySel('team-name-input').type('Team One');
		cy.getBySel('team-logo-input').type('https://example.com/logo1.png');

		cy.getBySel('submit-create-team-btn').click();

		cy.getBySel('toast-container').contains(CREATE_TEAM_SUCCESS_MESSAGE);

		cy.wait('@get-team-user');

		cy.getBySel('team-name').should('have.text', 'Team One');
		cy.getBySel('card').should('have.length', 1);
	});

	it('should show an error message if create team fails', () => {
		cy.interceptApi(
			'/user/me',
			{ method: 'GET' },
			{ fixture: 'user/my-user.json' },
		).as('get-user');
		cy.interceptApi('/team', { method: 'POST' }, { statusCode: 500 });

		cy.getBySel('create-team-btn').click();
		cy.getBySel('team-name-input').type('Team One');
		cy.getBySel('team-logo-input').type('https://example.com/logo1.png');

		cy.getBySel('submit-create-team-btn').click();

		cy.getBySel('toast-container').contains(CREATE_TEAM_ERROR_MESSAGE);
	});

	it('should show an error message if get team players fails', () => {
		cy.interceptApi(
			'/user/me',
			{ method: 'GET' },
			{ fixture: 'user/my-user.json' },
		).as('get-user');
		cy.interceptApi(
			'/team',
			{ method: 'POST' },
			{ fixture: 'team/team-response.json' },
		);
		cy.interceptApi(
			'/team/1',
			{ method: 'GET' },
			{ fixture: 'team/team-response.json' },
		);
		cy.interceptApi(
			'/player?filter%5BteamId%5D=1',
			{ method: 'GET' },
			{ statusCode: 500 },
		);
		cy.interceptApi(
			'/user/me',
			{ method: 'GET' },
			{ fixture: 'user/my-team-user.json' },
		).as('get-team-user');

		cy.wait('@get-user');

		cy.getBySel('create-team-btn').click();
		cy.getBySel('team-name-input').type('Team One');
		cy.getBySel('team-logo-input').type('https://example.com/logo1.png');

		cy.getBySel('submit-create-team-btn').click();

		cy.wait('@get-team-user');
		cy.getBySel('toast-container').contains(GET_TEAM_ERROR_MESSAGE);

		cy.getBySel('team-players').should('exist').and('have.text', 'No players');
	});
});
