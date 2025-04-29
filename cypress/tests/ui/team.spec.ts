import {
	ADD_PLAYER_TO_ROSTER_ERROR_MESSAGE,
	CREATE_TEAM_ERROR_MESSAGE,
	CREATE_TEAM_SUCCESS_MESSAGE,
	GET_TEAM_ERROR_MESSAGE,
	REMOVE_PLAYER_FROM_ROSTER_ERROR_MESSAGE,
} from '@/constants/messages/team-messages';

describe('Team Page', () => {
	const simpleSignerUrl = Cypress.env('VITE_SIMPLE_SIGNER_URL');
	const walletAddress =
		'GCIFA5TO3C43J24C46MKPZEELRPOG3WKPUCTZX3JRLNG2IPHAECRXUY5';

	beforeEach(() => {
		cy.signInWithWallet(simpleSignerUrl, walletAddress);
		cy.visit('/team');
	});

	it('should render the team page', () => {
		cy.interceptApi(
			'/user/me',
			{ method: 'GET' },
			{ fixture: 'user/my-user.json' },
		);
		cy.interceptApi(
			'/player/sync/team',
			{ method: 'PATCH' },
			{
				fixture: 'player/empty-sync-team-response.json',
			},
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
			'/player/sync/team',
			{ method: 'PATCH' },
			{
				fixture: 'player/empty-sync-team-response.json',
			},
		);
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
			'/player?filter%5BteamId%5D=1&page%5Bnumber%5D=1&page%5Bsize%5D=11&sort%5BcreatedAt%5D=ASC',
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
		cy.interceptApi(
			'/player/sync/team',
			{ method: 'PATCH' },
			{
				fixture: 'player/empty-sync-team-response.json',
			},
		);
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
			'/player/sync/team',
			{ method: 'PATCH' },
			{
				fixture: 'player/empty-sync-team-response.json',
			},
		);
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
			'/player?filter%5BteamId%5D=1&page%5Bnumber%5D=1&page%5Bsize%5D=11&sort%5BcreatedAt%5D=ASC',
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

		cy.getBySel('team-players-no-players')
			.should('exist')
			.and('have.text', 'No players in team');
	});

	it('should add a player to roster', () => {
		cy.interceptApi(
			'/player/sync/team',
			{ method: 'PATCH' },
			{
				fixture: 'player/empty-sync-team-response.json',
			},
		);
		cy.interceptApi(
			'/user/me',
			{ method: 'GET' },
			{ fixture: 'user/my-team-user.json' },
		);
		cy.interceptApi(
			'/team/1',
			{ method: 'GET' },
			{ fixture: 'team/team-with-roster-response.json' },
		);
		cy.interceptApi(
			'/player?filter%5BteamId%5D=1&page%5Bnumber%5D=1&page%5Bsize%5D=11&sort%5BcreatedAt%5D=ASC',
			{ method: 'GET' },
			{ fixture: 'player/team-players-response.json' },
		);
		cy.interceptApi(
			'/roster/1?include%5Bfields%5D=players',
			{ method: 'GET' },
			{ fixture: 'roster/roster-response.json' },
		);

		cy.interceptApi(
			'/roster/1/player/550e8400-e29b-41d4-a716-446655440001',
			{ method: 'PATCH' },
			{ fixture: 'player/team-players-in-roster-response.json' },
		);
		cy.interceptApi(
			'/player?filter%5BteamId%5D=1&page%5Bnumber%5D=1&page%5Bsize%5D=11&sort%5BcreatedAt%5D=ASC',
			{ method: 'GET' },
			{ fixture: 'player/team-players-in-roster-response.json' },
		).as('get-players-in-roster');
		cy.interceptApi(
			'/roster/1?include%5Bfields%5D=players',
			{ method: 'GET' },
			{ fixture: 'roster/roster-with-player-response.json' },
		).as('get-roster-with-player');

		cy.getBySel('card')
			.first()
			.then((card) => {
				cy.wrap(card).find('button').click();
			});

		cy.wait('@get-players-in-roster');

		cy.getBySel('team-roster-tab').click();
		cy.wait('@get-roster-with-player');

		cy.getBySel('card').should('be.visible').and('have.length', 1);
	});

	it('should show an error message if add player to roster fails', () => {
		cy.interceptApi(
			'/player/sync/team',
			{ method: 'PATCH' },
			{
				fixture: 'player/empty-sync-team-response.json',
			},
		);
		cy.interceptApi(
			'/user/me',
			{ method: 'GET' },
			{ fixture: 'user/my-team-user.json' },
		);
		cy.interceptApi(
			'/team/1',
			{ method: 'GET' },
			{ fixture: 'team/team-with-roster-response.json' },
		);
		cy.interceptApi(
			'/player?filter%5BteamId%5D=1&page%5Bnumber%5D=1&page%5Bsize%5D=11&sort%5BcreatedAt%5D=ASC',
			{ method: 'GET' },
			{ fixture: 'player/team-players-response.json' },
		);
		cy.interceptApi(
			'/roster/1?include%5Bfields%5D=players',
			{ method: 'GET' },
			{ fixture: 'roster/roster-response.json' },
		);

		cy.interceptApi(
			'/roster/1/player/550e8400-e29b-41d4-a716-446655440001',
			{ method: 'PATCH' },
			{ statusCode: 500 },
		);

		cy.getBySel('card')
			.first()
			.then((card) => {
				cy.wrap(card).find('button').click();
			});

		cy.getBySel('toast-container').contains(ADD_PLAYER_TO_ROSTER_ERROR_MESSAGE);
	});

	it('should remove a player from roster', () => {
		cy.interceptApi(
			'/player/sync/team',
			{ method: 'PATCH' },
			{
				fixture: 'player/empty-sync-team-response.json',
			},
		);
		cy.interceptApi(
			'/user/me',
			{ method: 'GET' },
			{ fixture: 'user/my-team-user.json' },
		);
		cy.interceptApi(
			'/team/1',
			{ method: 'GET' },
			{ fixture: 'team/team-with-roster-response.json' },
		);
		cy.interceptApi(
			'/player?filter%5BteamId%5D=1&page%5Bnumber%5D=1&page%5Bsize%5D=11&sort%5BcreatedAt%5D=ASC',
			{ method: 'GET' },
			{ fixture: 'player/team-players-in-roster-response.json' },
		);
		cy.interceptApi(
			'/roster/1?include%5Bfields%5D=players',
			{ method: 'GET' },
			{ fixture: 'roster/roster-with-player-response.json' },
		);

		cy.interceptApi(
			'/roster/1/player/550e8400-e29b-41d4-a716-446655440001',
			{ method: 'DELETE' },
			{ fixture: 'player/team-players-in-roster-response.json' },
		);
		cy.interceptApi(
			'/player?filter%5BteamId%5D=1&page%5Bnumber%5D=1&page%5Bsize%5D=11&sort%5BcreatedAt%5D=ASC',
			{ method: 'GET' },
			{ fixture: 'player/team-players-response.json' },
		).as('get-players');
		cy.interceptApi(
			'/roster/1?include%5Bfields%5D=players',
			{ method: 'GET' },
			{ fixture: 'roster/roster-response.json' },
		).as('get-roster');

		cy.getBySel('card')
			.first()
			.then((card) => {
				cy.wrap(card).find('button').click();
			});

		cy.wait('@get-players');

		cy.getBySel('team-roster-tab').click();
		cy.wait('@get-roster');

		cy.getBySel('team-roster-no-players')
			.should('be.visible')
			.and('have.text', 'No players in roster');
	});

	it('should show an error message if remove player from roster fails', () => {
		cy.interceptApi(
			'/player/sync/team',
			{ method: 'PATCH' },
			{
				fixture: 'player/empty-sync-team-response.json',
			},
		);
		cy.interceptApi(
			'/user/me',
			{ method: 'GET' },
			{ fixture: 'user/my-team-user.json' },
		);
		cy.interceptApi(
			'/team/1',
			{ method: 'GET' },
			{ fixture: 'team/team-with-roster-response.json' },
		);
		cy.interceptApi(
			'/player?filter%5BteamId%5D=1&page%5Bnumber%5D=1&page%5Bsize%5D=11&sort%5BcreatedAt%5D=ASC',
			{ method: 'GET' },
			{ fixture: 'player/team-players-in-roster-response.json' },
		);
		cy.interceptApi(
			'/roster/1?include%5Bfields%5D=players',
			{ method: 'GET' },
			{ fixture: 'roster/roster-with-player-response.json' },
		);

		cy.interceptApi(
			'/roster/1/player/550e8400-e29b-41d4-a716-446655440001',
			{ method: 'DELETE' },
			{ statusCode: 500 },
		);

		cy.getBySel('card')
			.first()
			.then((card) => {
				cy.wrap(card).find('button').click();
			});

		cy.getBySel('toast-container').contains(
			REMOVE_PLAYER_FROM_ROSTER_ERROR_MESSAGE,
		);
	});
});
