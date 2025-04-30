describe('Formation Page', () => {
	const simpleSignerUrl = Cypress.env('VITE_SIMPLE_SIGNER_URL');
	const walletAddress =
		'GCIFA5TO3C43J24C46MKPZEELRPOG3WKPUCTZX3JRLNG2IPHAECRXUY5';

	beforeEach(() => {
		cy.signInWithWallet(simpleSignerUrl, walletAddress);
		cy.visit('/formation');
	});

	it('should render the formation page with default formation', () => {
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
			'/roster/1?include%5Bfields%5D=players',
			{ method: 'GET' },
			{ fixture: 'roster/roster-with-team-players-response.json' },
		);
		cy.interceptApi(
			'/formation?filter%5BrosterUuid%5D=1',
			{ method: 'GET' },
			{ fixture: 'formation/formations-response.json' },
		);

		cy.getBySel('formation-title')
			.should('be.visible')
			.and('contain.text', 'Tactical Formation:');
		cy.getBySel('formation-select').should('be.visible');
		cy.getBySel('saved-formations-select').should('be.visible');
		cy.getBySel('formation-players-list').should('be.visible');
	});

	it('should change formation when selecting a different preset formation', () => {
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
			'/roster/1?include%5Bfields%5D=players',
			{ method: 'GET' },
			{ fixture: 'roster/roster-with-team-players-response.json' },
		);
		cy.interceptApi(
			'/formation?filter%5BrosterUuid%5D=1',
			{ method: 'GET' },
			{ fixture: 'formation/formations-response.json' },
		);

		cy.getBySel('formation-select').select('2');
		cy.getBySel('formation-title').should('contain.text', '4-3-3');
	});

	it('should load saved formation when selected', () => {
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
			'/roster/1?include%5Bfields%5D=players',
			{ method: 'GET' },
			{ fixture: 'roster/roster-with-team-players-response.json' },
		);
		cy.interceptApi(
			'/formation?filter%5BrosterUuid%5D=1',
			{ method: 'GET' },
			{ fixture: 'formation/formations-response.json' },
		);
		cy.interceptApi(
			'/formation/550e8400-e29b-41d4-a716-446655440000?include[fields]=formationPlayers',
			{ method: 'GET' },
			{ fixture: 'formation/saved-formation-response.json' },
		);

		cy.getBySel('saved-formations-select').select(
			'550e8400-e29b-41d4-a716-446655440000',
		);
		cy.getBySel('formation-name-input')
			.scrollIntoView()
			.should('have.value', 'Testing');
	});

	it('should save a new formation successfully', () => {
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
			'/roster/1?include%5Bfields%5D=players',
			{ method: 'GET' },
			{ fixture: 'roster/roster-with-team-players-response.json' },
		);
		cy.interceptApi(
			'/formation?filter%5BrosterUuid%5D=1',
			{ method: 'GET' },
			{ fixture: 'formation/formations-response.json' },
		);
		cy.interceptApi(
			'/formation',
			{ method: 'POST' },
			{ fixture: 'formation/new-formation-response.json' },
		).as('save-formation');

		cy.getBySel('goalkeeper-position-spot-0').click();
		cy.getBySel('formation-players-list')
			.find('[data-test="player-formation-card"]')
			.first()
			.click();

		Array.from({ length: 4 }).forEach((_, index) => {
			cy.getBySel(`defender-position-spot-${index}`).click();
			cy.getBySel('formation-players-list')
				.find('[data-test="player-formation-card"]')
				.first()
				.click();
		});
		Array.from({ length: 4 }).forEach((_, index) => {
			cy.getBySel(`midfielder-position-spot-${index}`).click();
			cy.getBySel('formation-players-list')
				.find('[data-test="player-formation-card"]')
				.first()
				.click();
		});
		Array.from({ length: 2 }).forEach((_, index) => {
			cy.getBySel(`forward-position-spot-${index}`).click();
			cy.getBySel('formation-players-list')
				.find('[data-test="player-formation-card"]')
				.first()
				.click();
		});

		cy.getBySel('formation-name-input').scrollIntoView().type('New Formation');
		cy.getBySel('save-formation-btn').click();
		cy.wait('@save-formation');

		cy.getBySel('toast-container').contains(
			'4-4-2 formation named New Formation was successfully created.',
		);
	});

	it('should show error when saving formation fails', () => {
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
			'/roster/1?include%5Bfields%5D=players',
			{ method: 'GET' },
			{ fixture: 'roster/roster-with-team-players-response.json' },
		);
		cy.interceptApi(
			'/formation?filter%5BrosterUuid%5D=1',
			{ method: 'GET' },
			{ fixture: 'formation/formations-response.json' },
		);
		cy.interceptApi('/formation', { method: 'POST' }, { statusCode: 500 }).as(
			'save-formation-error',
		);
		cy.interceptApi(
			'/formation/550e8400-e29b-41d4-a716-446655440000?include[fields]=formationPlayers',
			{ method: 'GET' },
			{ fixture: 'formation/saved-formation-response.json' },
		);
		cy.getBySel('saved-formations-select').select(
			'550e8400-e29b-41d4-a716-446655440000',
		);
		
		cy.getBySel('formation-select').select('2');
		cy.getBySel('formation-name-input').type('New Formation');
		cy.getBySel('save-formation-btn').click();
		cy.wait('@save-formation-error');

		cy.getBySel('toast-container').contains('Error saving formation');
	});

	it.only('should display an error message if the 11 players for the formation are not selected', () => {
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
			'/roster/1?include%5Bfields%5D=players',
			{ method: 'GET' },
			{ fixture: 'roster/roster-with-team-players-response.json' },
		);
		cy.interceptApi(
			'/formation?filter%5BrosterUuid%5D=1',
			{ method: 'GET' },
			{ fixture: 'formation/formations-response.json' },
		);
		
		cy.interceptApi(
			'/formation/550e8400-e29b-41d4-a716-446655440000?include[fields]=formationPlayers',
			{ method: 'GET' },
			{ fixture: 'formation/saved-formation-response.json' },
		);
		cy.getBySel('saved-formations-select').select(
			'550e8400-e29b-41d4-a716-446655440000',
		);
		
		cy.getBySel('formation-select').select('2');
		cy.getBySel('formation-name-input').type('New Formation');
		cy.getBySel("player-position").eq(0).find("button").first().click()
		cy.getBySel('save-formation-btn').click();

		cy.getBySel('toast-container').contains('You must select 11 players to create a formation.');
	});

	it('should update an existing formation successfully', () => {
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
			'/roster/1?include%5Bfields%5D=players',
			{ method: 'GET' },
			{ fixture: 'roster/roster-with-team-players-response.json' },
		);
		cy.interceptApi(
			'/formation?filter%5BrosterUuid%5D=1',
			{ method: 'GET' },
			{ fixture: 'formation/formations-response.json' },
		);
		cy.interceptApi(
			'/formation/550e8400-e29b-41d4-a716-446655440000?include[fields]=formationPlayers',
			{ method: 'GET' },
			{ fixture: 'formation/saved-formation-response.json' },
		);
		cy.interceptApi(
			'/formation',
			{ method: 'PATCH' },
			{ fixture: 'formation/updated-formation-response.json' },
		).as('update-formation');

		cy.getBySel('saved-formations-select').select(
			'550e8400-e29b-41d4-a716-446655440000',
		);
		cy.getBySel('goalkeeper-position-spot-0').click();

		cy.getBySel('formation-players-list')
			.find('[data-test="player-formation-card"]')
			.first()
			.click();

		cy.getBySel('formation-name-input').clear().type('Updated Formation');
		cy.getBySel('save-formation-btn').click();
		cy.wait('@update-formation');
		cy.getBySel('toast-container').contains(
			'3-5-2 formation named Updated Formation was successfully updated.',
		);
	});

	it('should show error when updating formation fails', () => {
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
			'/roster/1?include%5Bfields%5D=players',
			{ method: 'GET' },
			{ fixture: 'roster/roster-with-team-players-response.json' },
		);
		cy.interceptApi(
			'/formation?filter%5BrosterUuid%5D=1',
			{ method: 'GET' },
			{ fixture: 'formation/formations-response.json' },
		);
		cy.interceptApi(
			'/formation/550e8400-e29b-41d4-a716-446655440000?include[fields]=formationPlayers',
			{ method: 'GET' },
			{ fixture: 'formation/saved-formation-response.json' },
		);
		cy.interceptApi('/formation', { method: 'PATCH' }, { statusCode: 500 }).as(
			'update-formation-error',
		);

		cy.getBySel('saved-formations-select').select(
			'550e8400-e29b-41d4-a716-446655440000',
		);
		cy.getBySel('formation-name-input').clear().type('Updated Formation');
		cy.getBySel('save-formation-btn').click();
		cy.wait('@update-formation-error');

		cy.getBySel('toast-container').contains('Error updating formation');
	});

	it('should show error when getting team data fails', () => {
		cy.interceptApi(
			'/user/me',
			{ method: 'GET' },
			{ fixture: 'user/my-team-user.json' },
		);
		cy.interceptApi('/team/1', { method: 'GET' }, { statusCode: 500 }).as(
			'get-team-error',
		);

		cy.getBySel('toast-container').contains(
			'An error occurred while getting the team. Please try again later.',
		);
	});
});
