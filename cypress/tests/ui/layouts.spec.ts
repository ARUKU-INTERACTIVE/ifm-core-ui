describe('Layouts', () => {
	describe('Private Layout', () => {
		it('should redirect to login when accessing private route without auth', () => {
			cy.visit('/about');
			cy.url().should('include', '/');
		});

		it('should allow access to private route when authenticated', () => {
			cy.signIn();
			cy.visit('/about');
			cy.url().should('include', '/about');
		});
	});

	describe('Auth Layout', () => {
		it('should redirect to about page when accessing auth pages while authenticated', () => {
			cy.signIn();
			cy.visit('/auth/sign-in');
			cy.url().should('include', '/');
		});

		it('should allow access to auth routes when not authenticated', () => {
			cy.visit('/auth/sign-in');
			cy.url().should('include', '/auth/sign-in');
		});
	});

	describe('Public Layout', () => {
		it('should allow access to public routes when not authenticated', () => {
			cy.visit('/');
			cy.url().should('include', '/');
		});

		it('should allow access to public routes when authenticated', () => {
			cy.signIn();
			cy.visit('/');
			cy.url().should('include', '/');
		});

		it('should allow access to sign-out when authenticated', () => {
			cy.signIn();
			cy.visit('/auth/sign-out');
			cy.url().should('include', '/auth/sign-out');
		});
	});
});
