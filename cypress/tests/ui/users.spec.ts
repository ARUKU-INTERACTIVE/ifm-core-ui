describe('Users Page', () => {
	beforeEach(() => {
		cy.visit('/users');
	});

	it('should display loading state initially', () => {
		cy.intercept('GET', 'https://jsonplaceholder.typicode.com/users', {
			delay: 1000,
			fixture: '/user/users.json',
		}).as('getUsers');

		cy.getBySel('loading-spinner').should('be.visible');
		cy.wait('@getUsers');
	});

	it('should display users when API call is successful', () => {
		cy.intercept('GET', 'https://jsonplaceholder.typicode.com/users', {
			fixture: '/user/users.json',
		}).as('getUsers');

		cy.wait('@getUsers');
		cy.getBySel('users-list').should('be.visible');
		cy.getBySel('user-card').should('have.length.at.least', 1);
	});

	it('should display error message when API call fails', () => {
		cy.intercept('GET', 'https://jsonplaceholder.typicode.com/users', {
			statusCode: 500,
			body: { message: 'Server error' },
		}).as('getUsersError');

		cy.getBySel('error-message').should('be.visible');
	});
});
