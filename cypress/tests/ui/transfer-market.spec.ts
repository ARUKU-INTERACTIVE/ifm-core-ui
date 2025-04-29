import { TRANSACTION_SIGNED_MESSAGE } from '@context/auth-messages';

import auctionFixture from '../../fixtures/auction/auctions-response.json';

import {
	CREATE_AUCTION_TRANSACTION_ERROR_MESSAGE,
	SUBMIT_CREATE_AUCTION_SUCCESS_MESSAGE,
} from '@/interfaces/auction/auction-messages';

import {
	PLAYER_MINTED_ERROR,
	PLAYER_MINTED_SUCCESSFULLY,
	SUBMIT_MINT_PLAYER_SAC_ERROR_MESSAGE,
	SUBMIT_MINT_PLAYER_SAC_SUCCESS_MESSAGE,
} from '@components/player/player-messages';

describe('Transfer Market', () => {
	const simpleSignerUrl = Cypress.env('VITE_SIMPLE_SIGNER_URL');
	const walletAddress =
		'GCTIUQVU4GWDINAEC3B2E2PMVTW45YQ5MMHKQI737YHCVP6UI4ET4G2R';

	beforeEach(() => {
		cy.signInWithWallet(simpleSignerUrl, walletAddress);
		cy.visit('/transfer-market');
	});

	it('should render correctly', () => {
		cy.interceptApi(
			'/player?sort%5BcreatedAt%5D=ASC',
			{ method: 'GET' },
			{ fixture: 'player/players-response.json' },
		);

		cy.getBySel('transfer-market-title').should('contain', 'Transfer Market');
		cy.getBySel('card').should('have.length', 2);
	});

	it('should search a player by its name', () => {
		const searchValue = 'two';
		cy.interceptApi(
			`/player?filter%5Bname%5D=${searchValue}&sort%5BcreatedAt%5D=ASC`,
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

	it('should mint a player', () => {
		cy.interceptApi(
			'/player?sort%5BcreatedAt%5D=ASC',
			{ method: 'GET' },
			{ fixture: 'player/players-response.json' },
		);
		cy.interceptApi(
			'/player/mint',
			{ method: 'POST' },
			{ fixture: 'player/mint-player-response.json' },
		);
		cy.interceptApi(
			'/player/submit/mint',
			{ method: 'POST' },
			{ fixture: 'player/submit-mint-player-response.json' },
		);

		cy.window().then((window) => {
			cy.stub(window, 'open')
				.as('mint-player')
				.callsFake(() => null);
		});

		cy.getBySel('transfer-market-mint-player-button').click();
		cy.getBySel('mint-player-modal-title').should('contain', 'Mint Player');

		cy.getBySel('mint-player-image-input').attachFile('/player/test.png', {
			force: true,
		});
		cy.getBySel('mint-player-name-input').type('Player Three');
		cy.getBySel('mint-player-description-input').type('Test description');
		cy.getBySel('mint-player-button').click();

		cy.get('@mint-player').should('be.called');

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

		cy.wait(1000);

		cy.getBySel('toast-container').contains(TRANSACTION_SIGNED_MESSAGE);
		cy.getBySel('toast-container').contains(PLAYER_MINTED_SUCCESSFULLY);
	});

	it('should show an error if the player is not minted', () => {
		cy.interceptApi(
			'/player?sort%5BcreatedAt%5D=ASC',
			{ method: 'GET' },
			{ fixture: 'player/players-response.json' },
		);
		cy.interceptApi(
			'/player/mint',
			{ method: 'POST' },
			{ fixture: 'player/mint-player-response.json' },
		);
		cy.interceptApi(
			'/player/submit/mint',
			{ method: 'POST' },
			{ statusCode: 500 },
		);

		cy.window().then((window) => {
			cy.stub(window, 'open')
				.as('mint-player')
				.callsFake(() => null);
		});

		cy.getBySel('transfer-market-mint-player-button').click();
		cy.getBySel('mint-player-modal-title').should('contain', 'Mint Player');

		cy.getBySel('mint-player-image-input').attachFile('/player/test.png', {
			force: true,
		});
		cy.getBySel('mint-player-name-input').type('Player Three');
		cy.getBySel('mint-player-description-input').type('Test description');
		cy.getBySel('mint-player-button').click();

		cy.get('@mint-player').should('be.called');

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

		cy.getBySel('toast-container').contains(PLAYER_MINTED_ERROR);
	});

	it('should mint and submit a player sac', () => {
		cy.interceptApi(
			'/player?sort%5BcreatedAt%5D=ASC',
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
			'/player?sort%5BcreatedAt%5D=ASC',
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
			'/player?sort%5BcreatedAt%5D=ASC',
			{ method: 'GET' },
			{ fixture: 'player/players-response.json' },
		).as('get-players');
		cy.interceptApi(
			'/auction/create/transaction',
			{ method: 'POST' },
			{ fixture: 'xdr-response.json' },
		);
		cy.interceptApi(
			'/auction',
			{ method: 'GET' },
			{
				body: {
					data: [
						{
							...auctionFixture.data[0],
							attributes: {
								...auctionFixture.data[0].attributes,
								playerAddress: 'address_5',
							},
						},
						{
							...auctionFixture.data[1],
							attributes: {
								...auctionFixture.data[1].attributes,
								playerAddress: 'address_6',
							},
						},
						...auctionFixture.data.slice(2),
					],
				},
			},
		).as('get-auctions');
		cy.interceptApi(
			'/auction/submit/transaction',
			{ method: 'POST' },
			{ fixture: 'auction/auction-response.json' },
		).as('submit-auction');

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

		cy.interceptApi(
			'/auction',
			{ method: 'GET' },
			{
				body: {
					data: [
						{
							...auctionFixture.data[0],
							attributes: {
								...auctionFixture.data[0].attributes,
								playerAddress: 'address_2',
							},
						},
					],
				},
			},
		).as('get-updated-auctions');
		cy.wait('@get-updated-auctions');
		cy.getBySel('toast-container').contains(TRANSACTION_SIGNED_MESSAGE);
		cy.getBySel('toast-container').contains(
			SUBMIT_CREATE_AUCTION_SUCCESS_MESSAGE,
		);

		cy.getBySel('auction-time-left').should('contain', '1 hour');
	});

	it('should show an error message if create auction fails', () => {
		cy.interceptApi(
			'/player?sort%5BcreatedAt%5D=ASC',
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
			{
				body: {
					data: [
						{
							...auctionFixture.data[0],
							attributes: {
								...auctionFixture.data[0].attributes,
								playerAddress: 'address_5',
							},
						},
						{
							...auctionFixture.data[1],
							attributes: {
								...auctionFixture.data[1].attributes,
								playerAddress: 'address_6',
							},
						},
						...auctionFixture.data.slice(2),
					],
				},
			},
		).as('get-auctions');
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
			CREATE_AUCTION_TRANSACTION_ERROR_MESSAGE,
		);
	});
});
