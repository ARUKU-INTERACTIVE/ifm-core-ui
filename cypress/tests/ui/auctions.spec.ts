import {
	CONNECT_WALLET_MESSAGE,
	SIGN_IN_SUCCESS_MESSAGE,
	TRANSACTION_SIGNED_MESSAGE,
} from '@context/auth-messages';

import {
	SUBMIT_PLACE_BID_ERROR_MESSAGE,
	SUBMIT_PLACE_BID_SUCCESS_MESSAGE,
} from '@/interfaces/auction/auction-messages';

describe('Auctions Page', () => {
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

		cy.visit('/auctions');
	});

	it('should show the auctions page', () => {
		cy.interceptApi(
			'/auction',
			{ method: 'GET' },
			{ fixture: 'auction/auctions-response.json' },
		);
		cy.interceptApi(
			'/user/me',
			{ method: 'GET' },
			{ fixture: 'user/my-user.json' },
		);
		cy.interceptApi(
			'/player',
			{ method: 'GET' },
			{ fixture: 'auction/auction-page-players-response.json' },
		);

		cy.getBySel('auctions-title').should('contain', 'Auctions');
		cy.getBySel('auction-card').should('have.length', 3);
	});

	it('should search an auction by its player name', () => {
		const searchValue = 'three';
		cy.interceptApi(
			'/auction',
			{ method: 'GET' },
			{ fixture: 'auction/auctions-response.json' },
		);
		cy.interceptApi(
			`/player?filter%5Bname%5D=${searchValue}`,
			{ method: 'GET' },
			{ fixture: 'auction/search-auction-player-response.json' },
		);
		cy.interceptApi(
			'/auction',
			{ method: 'GET' },
			{ fixture: 'auction/search-auction-response.json' },
		);
		cy.interceptApi(
			'/user/me',
			{ method: 'GET' },
			{ fixture: 'user/my-user.json' },
		);

		cy.getBySel('auctions-searchbar').type(searchValue);
		cy.wait(200);

		cy.getBySel('auction-card')
			.should('have.length', 1)
			.and('contain.text', 'Player Three');
	});

	it('should submit a bid for an auction', () => {
		cy.interceptApi(
			'/auction',
			{ method: 'GET' },
			{ fixture: 'auction/auctions-response.json' },
		).as('get-auctions');
		cy.interceptApi(
			'/user/me',
			{ method: 'GET' },
			{ fixture: 'user/my-user.json' },
		);
		cy.interceptApi(
			'/player',
			{ method: 'GET' },
			{ fixture: 'auction/auction-page-players-response.json' },
		);
		cy.interceptApi(
			'/auction/create/transaction/place-bid',
			{ method: 'POST' },
			{ fixture: 'xdr-response.json' },
		);
		cy.interceptApi(
			'/auction/submit/transaction/place-bid',
			{ method: 'POST' },
			{ fixture: 'auction/bid-auction-response.json' },
		);
		cy.interceptApi(
			'/auction',
			{ method: 'GET' },
			{ fixture: 'auction/auctions-bid-response.json' },
		).as('get-bid-auctions');

		cy.window().then((window) => {
			cy.stub(window, 'open')
				.as('bid-auction')
				.callsFake(() => null);
		});
		cy.wait('@get-auctions');

		cy.getBySel('auction-card')
			.first()
			.then((card) => {
				cy.wrap(card).find('button').click();
			});

		cy.getBySel('bid-amount-input').clear().type('2000');

		cy.getBySel('submit-bid-btn').click();
		cy.get('@bid-auction').should('be.called');

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
		cy.getBySel('toast-container').contains(SUBMIT_PLACE_BID_SUCCESS_MESSAGE);

		cy.wait('@get-bid-auctions');
		cy.getBySel('highest-bidder-msg').should('be.visible');
	});

	it('should throw an error if submit bid fails', () => {
		cy.interceptApi(
			'/auction',
			{ method: 'GET' },
			{ fixture: 'auction/auctions-response.json' },
		).as('get-auctions');
		cy.interceptApi(
			'/user/me',
			{ method: 'GET' },
			{ fixture: 'user/my-user.json' },
		);
		cy.interceptApi(
			'/player',
			{ method: 'GET' },
			{ fixture: 'auction/auction-page-players-response.json' },
		);
		cy.interceptApi(
			'/auction/create/transaction/place-bid',
			{ method: 'POST' },
			{ fixture: 'xdr-response.json' },
		);
		cy.interceptApi(
			'/auction/submit/transaction/place-bid',
			{ method: 'POST' },
			{ statusCode: 500 },
		);

		cy.window().then((window) => {
			cy.stub(window, 'open')
				.as('bid-auction')
				.callsFake(() => null);
		});
		cy.wait('@get-auctions');

		cy.getBySel('auction-card')
			.first()
			.then((card) => {
				cy.wrap(card).find('button').click();
			});

		cy.getBySel('bid-amount-input').clear().type('2000');

		cy.getBySel('submit-bid-btn').click();
		cy.get('@bid-auction').should('be.called');

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
		cy.getBySel('toast-container').contains(SUBMIT_PLACE_BID_ERROR_MESSAGE);
	});
});
