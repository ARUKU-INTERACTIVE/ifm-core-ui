import {
	CONNECT_WALLET_MESSAGE,
	SIGN_IN_SUCCESS_MESSAGE,
	TRANSACTION_SIGNED_MESSAGE,
} from '@context/auth-messages';

import {
	SUBMIT_CREATE_AUCTION_ERROR_MESSAGE,
	SUBMIT_CREATE_AUCTION_SUCCESS_MESSAGE,
} from '@/interfaces/auction/auction-messages';

import {
	SUBMIT_MINT_PLAYER_SAC_ERROR_MESSAGE,
	SUBMIT_MINT_PLAYER_SAC_SUCCESS_MESSAGE,
} from '@components/player/player-messages';

describe('Transfer Market', () => {
	const simpleSignerUrl = Cypress.env('VITE_SIMPLE_SIGNER_URL');
	const walletAddress =
		'GCTIUQVU4GWDINAEC3B2E2PMVTW45YQ5MMHKQI737YHCVP6UI4ET4G2R';

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
		cy.getBySel('card').should('have.length', 2);
	});

	it('should search a player by its name', () => {
		const searchValue = 'two';
		cy.interceptApi(
			`/player?filter%5Bname%5D=${searchValue}`,
			{ method: 'GET' },
			{ fixture: 'player/player-response.json' },
		);

		cy.getBySel('transfer-market-title').should('contain', 'Transfer Market');
		cy.getBySel('transfer-market-searchbar').type(searchValue);
		cy.wait(200);

		cy.getBySel('card')
			.should('have.length', 1)
			.and('contain.text', 'Player Two');
	});

	it('should mint and submit a player sac', () => {
		cy.interceptApi(
			'/player',
			{ method: 'GET' },
			{ fixture: 'player/players-response.json' },
		);
		cy.interceptApi(
			'/player/sac/1',
			{ method: 'POST' },
			{ fixture: 'xdr-response.json' },
		);
		cy.interceptApi(
			'/player/submit/sac/1',
			{ method: 'POST' },
			{ fixture: 'player/player-response.json' },
		);
		cy.interceptApi(
			'/auction',
			{ method: 'GET' },
			{ fixture: 'auction/auctions-response.json' },
		);

		cy.window().then((window) => {
			cy.stub(window, 'open')
				.as('mint-player-sac')
				.callsFake(() => null);
		});

		cy.getBySel('enable-auction-btn').click();

		cy.get('@mint-player-sac').should('be.called');

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
		cy.getBySel('toast-container').contains(
			SUBMIT_MINT_PLAYER_SAC_SUCCESS_MESSAGE,
		);
	});

	it('should show an error message if submit player sac fails', () => {
		cy.interceptApi(
			'/player',
			{ method: 'GET' },
			{ fixture: 'player/players-response.json' },
		);
		cy.interceptApi(
			'/player/sac/1',
			{ method: 'POST' },
			{ fixture: 'xdr-response.json' },
		);
		cy.interceptApi(
			'/player/submit/sac/1',
			{ method: 'POST' },
			{
				statusCode: 500,
			},
		);
		cy.interceptApi(
			'/auction',
			{ method: 'GET' },
			{ fixture: 'auction/auctions-response.json' },
		);

		cy.window().then((window) => {
			cy.stub(window, 'open')
				.as('mint-player-sac')
				.callsFake(() => null);
		});

		cy.getBySel('card')
			.first()
			.then((card) => {
				cy.wrap(card).find('button').click();
			});

		cy.get('@mint-player-sac').should('be.called');

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
		cy.getBySel('toast-container').contains(
			SUBMIT_MINT_PLAYER_SAC_ERROR_MESSAGE,
		);
	});

	it('should create and submit an auction', () => {
		cy.interceptApi(
			'/player',
			{ method: 'GET' },
			{ fixture: 'player/players-response.json' },
		);
		cy.interceptApi(
			'/auction/create/transaction',
			{ method: 'POST' },
			{ fixture: 'xdr-response.json' },
		);
		cy.interceptApi(
			'/auction',
			{ method: 'GET' },
			{ fixture: 'auction/auctions-response.json' },
		);
		cy.interceptApi(
			'/auction/submit/transaction',
			{ method: 'POST' },
			{ fixture: 'auction/auction-response.json' },
		);

		cy.window().then((window) => {
			cy.stub(window, 'open')
				.as('create-auction')
				.callsFake(() => null);
		});

		cy.getBySel('create-auction-btn').click();

		cy.getBySel('starting-price-input').clear().type('100');
		cy.getBySel('auction-time-input').clear().type('1');
		cy.getBySel('submit-auction-btn').click();

		cy.get('@create-auction').should('be.called');

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
		cy.getBySel('toast-container').contains(
			SUBMIT_CREATE_AUCTION_SUCCESS_MESSAGE,
		);

		cy.getBySel('auction-time-left').should(
			'contain',
			'Auction Time Left: 1 hours',
		);
	});

	it('should show an error message if create auction fails', () => {
		cy.interceptApi(
			'/player',
			{ method: 'GET' },
			{ fixture: 'player/players-response.json' },
		);
		cy.interceptApi(
			'/auction/create/transaction',
			{ method: 'POST' },
			{ fixture: 'xdr-response.json' },
		);
		cy.interceptApi(
			'/auction',
			{ method: 'GET' },
			{ fixture: 'auction/auctions-response.json' },
		);
		cy.interceptApi(
			'/auction/submit/transaction',
			{ method: 'POST' },
			{
				statusCode: 500,
			},
		);

		cy.window().then((window) => {
			cy.stub(window, 'open')
				.as('create-auction')
				.callsFake(() => null);
		});

		cy.getBySel('create-auction-btn').click();

		cy.getBySel('starting-price-input').clear().type('100');
		cy.getBySel('auction-time-input').clear().type('1');
		cy.getBySel('submit-auction-btn').click();

		cy.get('@create-auction').should('be.called');

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
		cy.getBySel('toast-container').contains(
			SUBMIT_CREATE_AUCTION_ERROR_MESSAGE,
		);
	});
});
