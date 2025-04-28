/// <reference types="cypress" />
import {
	CONNECT_WALLET_MESSAGE,
	SIGN_IN_SUCCESS_MESSAGE,
	TRANSACTION_SIGNED_MESSAGE,
} from '@context/auth-messages';

import {
	CODE_MIN_LENGTH,
	CODE_REQUIRED,
	CODE_TYPE,
	PASSWORD_LOWERCASE,
	PASSWORD_MIN_LENGTH,
	PASSWORD_NUMBER,
	PASSWORD_REQUIRED,
	PASSWORD_SPECIAL,
	PASSWORD_UPPERCASE,
	USERNAME_INVALID,
	USERNAME_REQUIRED,
} from '@components/auth/schemas/schema-errors';

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add('getBySel', (selector, ...args) => {
	return cy.get(`[data-test=${selector}]`, ...args);
});

Cypress.Commands.add('getBySelLike', (selector, ...args) => {
	return cy.get(`[data-test*=${selector}]`, ...args);
});

Cypress.Commands.add('clickLinkAndVerifyUrl', (selector, urlPart) => {
	cy.get(`[data-test="${selector}"]`).should('be.visible').click();
	cy.url().should('include', urlPart);
});

Cypress.Commands.add('getInputAndType', (selector, text) => {
	cy.get(`[data-test="${selector}"]`)
		.should('be.visible')
		.focus()
		.clear()
		.type(text)
		.should('have.value', text);
});

Cypress.Commands.add('interceptApi', (endpoint, matcher, handler) => {
	const baseUrl = Cypress.env('VITE_API_URL');
	return cy.intercept({ ...matcher, url: baseUrl + endpoint }, handler);
});

Cypress.Commands.add('validateUsername', (inputSelector, errorSelector) => {
	const username = 'example@test.com';
	const badUsername = 'someusername';

	cy.getBySel(inputSelector).focus().blur();
	cy.getBySel(errorSelector).contains(USERNAME_REQUIRED);

	cy.getInputAndType(inputSelector, badUsername).blur();
	cy.getBySel(errorSelector).contains(USERNAME_INVALID);

	cy.getInputAndType(inputSelector, username);
});

Cypress.Commands.add('validatePassword', (inputSelector, errorSelector) => {
	const shortPassword = 'some';
	const uppercaseErrorPassword = '@@1secret';
	const lowercaseErrorPassword = '@1SECRET';
	const noSymbolPassword = '11Secret';
	const noNumberPassword = '@@Secret';

	cy.getBySel(inputSelector).focus().blur();
	cy.getBySel(errorSelector).contains(PASSWORD_REQUIRED);

	cy.getInputAndType(inputSelector, shortPassword).blur();
	cy.getBySel(errorSelector).contains(PASSWORD_MIN_LENGTH);

	cy.getInputAndType(inputSelector, lowercaseErrorPassword).blur();
	cy.getBySel(errorSelector).contains(PASSWORD_LOWERCASE);

	cy.getInputAndType(inputSelector, uppercaseErrorPassword).blur();
	cy.getBySel(errorSelector).contains(PASSWORD_UPPERCASE);

	cy.getInputAndType(inputSelector, noSymbolPassword).blur();
	cy.getBySel(errorSelector).contains(PASSWORD_SPECIAL);

	cy.getInputAndType(inputSelector, noNumberPassword).blur();
	cy.getBySel(errorSelector).contains(PASSWORD_NUMBER);
});

Cypress.Commands.add('validateCode', (inputSelector, errorSelector) => {
	const shortCode = '12345';
	const noLetters = 'A12345';
	cy.getBySel(inputSelector).focus().blur();
	cy.getBySel(errorSelector).contains(CODE_REQUIRED);
	cy.getInputAndType(inputSelector, shortCode).blur();
	cy.getBySel(errorSelector).contains(CODE_MIN_LENGTH);
	cy.getInputAndType(inputSelector, noLetters).blur();
	cy.getBySel(errorSelector).contains(CODE_TYPE);
});

Cypress.Commands.add('signIn', () => {
	const username = 'example@test.com';
	const password = 'Supersecret2024~';
	cy.visit('/auth/sign-in');
	cy.getInputAndType('sign-in-username', username);
	cy.getInputAndType('sign-in-password', password);
	cy.interceptApi(
		'/auth/sign-in',
		{ method: 'POST' },
		{ fixture: 'auth/sign-in.json' },
	).as('sign-in');
	cy.getBySel('sign-in-submit').click();
	cy.wait('@sign-in');
});

Cypress.Commands.add('signInWithWallet', (simpleSignerUrl, walletAddress) => {
	cy.visit('/');
	cy.interceptApi(
		`/auth/challenge?publicKey=${walletAddress}`,
		{ method: 'GET' },
		{ fixture: 'auth/challenge-transaction-response.json' },
	).as('get-challenge');
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

	cy.getBySel('sign-in-btn').should('have.text', 'Connect Wallet').click();
	cy.getBySel('connect-wallet-button').click();

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

	cy.wait(4000);

	cy.getBySel('sign-in-btn').should('have.text', 'Sign In');
	cy.getBySel('sign-in-with-transaction-button').click();
	cy.wait('@get-challenge');

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
		cy.wait(1000);
		cy.getBySel('toast-container').contains(TRANSACTION_SIGNED_MESSAGE);
		cy.getBySel('toast-container').contains(SIGN_IN_SUCCESS_MESSAGE);
	});
});
