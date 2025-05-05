import { TRANSACTION_SIGNED_MESSAGE } from '@context/auth-messages';

import auctionFixture from '../../fixtures/auction/auctions-response.json';

import { CREATE_ADD_TRUSTLINE_TRANSACTION_XDR_SUCCESS_MESSAGE } from '@/hooks/stellar/stellar-messages';
import {
	SUBMIT_CLAIM_TRANSACTION_ERROR_MESSAGE,
	SUBMIT_CLAIM_TRANSACTION_SUCCESS_MESSAGE,
	SUBMIT_PLACE_BID_ERROR_MESSAGE,
	SUBMIT_PLACE_BID_SUCCESS_MESSAGE,
} from '@/interfaces/auction/auction-messages';

describe('Auctions Page', () => {
	const simpleSignerUrl = Cypress.env('VITE_SIMPLE_SIGNER_URL');
	const walletAddress =
		'GCIFA5TO3C43J24C46MKPZEELRPOG3WKPUCTZX3JRLNG2IPHAECRXUY5';

	beforeEach(() => {
		cy.signInWithWallet(simpleSignerUrl, walletAddress);
		cy.visit('/auctions');
	});

	it('should show the auctions page', () => {
		cy.interceptApi(
			'/auction?page%5Bnumber%5D=1&page%5Bsize%5D=11',
			{ method: 'GET' },
			{ fixture: 'auction/auctions-response.json' },
		).as('get-auctions');
		cy.interceptApi(
			'/user/me',
			{ method: 'GET' },
			{ fixture: 'user/my-user.json' },
		);
		cy.interceptApi(
			'/player?sort%5BcreatedAt%5D=DESC',
			{ method: 'GET' },
			{ fixture: 'auction/auction-page-players-response.json' },
		);
		cy.wait('@get-auctions');

		cy.getBySel('auctions-title').should('contain', 'Auctions');
		cy.getBySel('auction-card').should('have.length', 3);
	});

	it('should search an auction by its player name', () => {
		const searchValue = 'three';
		cy.interceptApi(
			'/auction?**',
			{ method: 'GET' },
			{ fixture: 'auction/auctions-response.json' },
		).as('get-auctions');
		cy.interceptApi(
			'/user/me',
			{ method: 'GET' },
			{ fixture: 'user/my-user.json' },
		);
		cy.interceptApi(
			'/player?sort%5BcreatedAt%5D=DESC',
			{ method: 'GET' },
			{ fixture: 'auction/auction-page-players-response.json' },
		);
		cy.interceptApi(
			`/player?filter%5Bname%5D=${searchValue}&sort%5BcreatedAt%5D=DESC`,
			{ method: 'GET' },
			{ fixture: 'auction/search-auction-player-response.json' },
		).as('get-player-by-name');
		cy.interceptApi(
			'/auction',
			{ method: 'GET' },
			{ fixture: 'auction/search-auction-response.json' },
		);

		cy.intercept(`**/accounts/${walletAddress}`, {
			id: walletAddress,
			account_id: walletAddress,
			sequence: '523470614036490',
			balances: [
				{
					asset_code: 'NFT',
					balance: '0.0000001',
					asset_issuer:
						'GCFK2GVIJDIWVGPCG7OAE54SXSAITK5QCF4OMIQVEI4YIIM2H2N7IPHQ',
					asset_type: 'credit_alphanum4',
				},
			],
		});

		cy.getBySel('auctions-searchbar').type(searchValue);
		cy.wait('@get-player-by-name');

		cy.getBySel('auction-card')
			.should('have.length', 1)
			.and('contain.text', 'Player Three');
	});

	it('should submit a bid for an auction', () => {
		cy.interceptApi(
			'/auction?page%5Bnumber%5D=1&page%5Bsize%5D=11',
			{ method: 'GET' },
			{
				body: {
					data: [
						{
							...auctionFixture.data[0],
							attributes: {
								...auctionFixture.data[0].attributes,
								endTime: Math.floor(Date.now() / 1000) + 3600,
								startTime: Math.floor(Date.now() / 1000),
							},
						},
					],
				},
			},
		).as('get-auctions');
		cy.interceptApi(
			'/user/me',
			{ method: 'GET' },
			{ fixture: 'user/my-user.json' },
		);
		cy.interceptApi(
			'/player?sort%5BcreatedAt%5D=DESC',
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
			'/auction?page%5Bnumber%5D=1&page%5Bsize%5D=11',
			{ method: 'GET' },
			{ fixture: 'auction/auctions-bid-response.json' },
		).as('get-bid-auctions');

		cy.window().then((window) => {
			cy.stub(window, 'open')
				.as('bid-auction')
				.callsFake(() => null);
		});

		cy.getBySel('auction-card')
			.first()
			.then((card) => {
				cy.wrap(card).find('button').click();
			});

		cy.getBySel('add-trustline-btn').click();

		cy.intercept(`**/accounts/${walletAddress}`, {
			id: walletAddress,
			account_id: walletAddress,
			sequence: '523470614036490',
			balances: [
				{
					asset_code: 'NFT',
					balance: '0.0000001',
					asset_issuer:
						'GBXGQJWVLWOYHFLVTKWV5FGHA3LNYY2JQKM7OAJAUEQFU6LPCSEFVXON',
					asset_type: 'credit_alphanum4',
				},
			],
		});

		const signTrustlineEvent = new MessageEvent('message', {
			data: {
				type: 'onSign',
				page: `${simpleSignerUrl}/sign`,
				message: {
					signedXDR:
						'AAAAAgAAAAAzKM7rHj7CzGJLEyD/YyZgMXT5iBq+fyRJMHxlstrYtwAAAGQAA2/qAAAAIgAAAAEAAAAAAAAAAAAAAABoD/FxAAAAAAAAAAEAAAAAAAAABgAAAAFORlQAAAAAAP09c03uexcRzegT2cLQ8TehJBTtbhZeRrCWUc1C2yFYf/////////8AAAAAAAAAAbLa2LcAAABA30r/mklEhP3rLtnVfGHKEIZhs+K2kPMyhJ0XkxgKBvMub7Lwqe+0LlzOb9g/qhllInsVD0cS/PMoqe4PFrtqBg==',
				},
			},
			origin: simpleSignerUrl,
		});

		cy.getBySel('toast-container').contains(
			CREATE_ADD_TRUSTLINE_TRANSACTION_XDR_SUCCESS_MESSAGE,
		);

		cy.window().then((win) => {
			win.dispatchEvent(signTrustlineEvent);
		});

		cy.getBySel('toast-container').contains(TRANSACTION_SIGNED_MESSAGE);

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

		cy.getBySel('auction-card')
			.last()
			.then((card) => {
				cy.wrap(card).find('button').should('not.exist');
			});
	});

	it('should throw an error if submit bid fails', () => {
		cy.interceptApi(
			'/auction?page%5Bnumber%5D=1&page%5Bsize%5D=11',
			{ method: 'GET' },
			{
				body: {
					data: [
						{
							...auctionFixture.data[0],
							attributes: {
								...auctionFixture.data[0].attributes,
								endTime: Math.floor(Date.now() / 1000) + 3600,
								startTime: Math.floor(Date.now() / 1000),
							},
						},
					],
				},
			},
		).as('get-auctions');
		cy.interceptApi(
			'/user/me',
			{ method: 'GET' },
			{ fixture: 'user/my-user.json' },
		);
		cy.interceptApi(
			'/player?sort%5BcreatedAt%5D=DESC',
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

		cy.getBySel('add-trustline-btn').click();

		cy.intercept(`**/accounts/${walletAddress}`, {
			id: walletAddress,
			account_id: walletAddress,
			sequence: '523470614036490',
			balances: [
				{
					asset_code: 'NFT',
					balance: '0.0000001',
					asset_issuer:
						'GBXGQJWVLWOYHFLVTKWV5FGHA3LNYY2JQKM7OAJAUEQFU6LPCSEFVXON',
					asset_type: 'credit_alphanum4',
				},
			],
		});

		const signTrustlineEvent = new MessageEvent('message', {
			data: {
				type: 'onSign',
				page: `${simpleSignerUrl}/sign`,
				message: {
					signedXDR:
						'AAAAAgAAAAAzKM7rHj7CzGJLEyD/YyZgMXT5iBq+fyRJMHxlstrYtwAAAGQAA2/qAAAAIgAAAAEAAAAAAAAAAAAAAABoD/FxAAAAAAAAAAEAAAAAAAAABgAAAAFORlQAAAAAAP09c03uexcRzegT2cLQ8TehJBTtbhZeRrCWUc1C2yFYf/////////8AAAAAAAAAAbLa2LcAAABA30r/mklEhP3rLtnVfGHKEIZhs+K2kPMyhJ0XkxgKBvMub7Lwqe+0LlzOb9g/qhllInsVD0cS/PMoqe4PFrtqBg==',
				},
			},
			origin: simpleSignerUrl,
		});

		cy.getBySel('toast-container').contains(
			CREATE_ADD_TRUSTLINE_TRANSACTION_XDR_SUCCESS_MESSAGE,
		);

		cy.window().then((win) => {
			win.dispatchEvent(signTrustlineEvent);
		});

		cy.getBySel('toast-container').contains(TRANSACTION_SIGNED_MESSAGE);

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

	it('should claim an auction', () => {
		cy.interceptApi(
			'/auction?page%5Bnumber%5D=1&page%5Bsize%5D=11',
			{ method: 'GET' },
			{ fixture: 'auction/claim-auctions-response.json' },
		).as('get-claim-auctions');
		cy.interceptApi(
			'/user/me',
			{ method: 'GET' },
			{ fixture: 'user/my-user.json' },
		);
		cy.interceptApi(
			'/player?sort%5BcreatedAt%5D=DESC',
			{ method: 'GET' },
			{ fixture: 'auction/auction-page-players-response.json' },
		);
		cy.interceptApi(
			'/auction/create/transaction/claim',
			{ method: 'POST' },
			{ fixture: 'xdr-response.json' },
		);
		cy.interceptApi(
			'/auction/submit/transaction/claim',
			{ method: 'POST' },
			{ fixture: 'auction/claimed-auction-response.json' },
		);

		cy.window().then((window) => {
			cy.stub(window, 'open')
				.as('claim-auction')
				.callsFake(() => null);
		});
		cy.wait('@get-claim-auctions');

		cy.getBySel('auction-card')
			.last()
			.then((card) => {
				cy.wrap(card).find('button').click();
			});

		cy.get('@claim-auction').should('be.called');

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
			'/auction?page%5Bnumber%5D=1&page%5Bsize%5D=11',
			{ method: 'GET' },
			{ fixture: 'auction/auctions-response.json' },
		).as('get-auctions');

		cy.getBySel('toast-container').contains(TRANSACTION_SIGNED_MESSAGE);
		cy.getBySel('toast-container').contains(
			SUBMIT_CLAIM_TRANSACTION_SUCCESS_MESSAGE,
		);

		cy.wait('@get-auctions');
		cy.getBySel('auction-card').should('have.length', 3);
	});

	it('should throw an error if fails to claim an auction', () => {
		cy.interceptApi(
			'/auction?page%5Bnumber%5D=1&page%5Bsize%5D=11',
			{ method: 'GET' },
			{ fixture: 'auction/claim-auctions-response.json' },
		).as('get-claim-auctions');
		cy.interceptApi(
			'/user/me',
			{ method: 'GET' },
			{ fixture: 'user/my-user.json' },
		);
		cy.interceptApi(
			'/player?sort%5BcreatedAt%5D=DESC',
			{ method: 'GET' },
			{ fixture: 'auction/auction-page-players-response.json' },
		);
		cy.interceptApi(
			'/auction/create/transaction/claim',
			{ method: 'POST' },
			{ fixture: 'xdr-response.json' },
		);
		cy.interceptApi(
			'/auction/submit/transaction/claim',
			{ method: 'POST' },
			{ statusCode: 500 },
		);

		cy.window().then((window) => {
			cy.stub(window, 'open')
				.as('claim-auction')
				.callsFake(() => null);
		});

		cy.wait('@get-claim-auctions');

		cy.getBySel('auction-card')
			.last()
			.then((card) => {
				cy.wrap(card).find('button').click();
			});

		cy.get('@claim-auction').should('be.called');

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
			SUBMIT_CLAIM_TRANSACTION_ERROR_MESSAGE,
		);
	});
});
