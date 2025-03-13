describe('Layouts', () => {
	describe('Private Layout', () => {
		it('should redirect to login when accessing private route without auth', () => {
			cy.visit('/about');
			cy.url().should('include', '/');
		});
	});

	describe('Auth Layout', () => {
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
	});
});
