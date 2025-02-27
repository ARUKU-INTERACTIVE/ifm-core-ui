import {
	CONFIRMATION_SENT_MESSAGE,
	CONNECT_WALLET_ERROR,
	CONNECT_WALLET_MESSAGE,
	SIGN_IN_SUCCESS_MESSAGE,
	SIGN_OUT_SUCCESS_MESSAGE,
	SIGN_TRANSACTION_ERROR,
	SIGN_UP_SUCCESS_MESSAGE,
	TRANSACTION_SIGNED_MESSAGE,
} from '@context/auth-messages';

describe('/auth', () => {
	const username = 'example@test.com';
	const password = 'Supersecret2024~';
	const code = '123456';
	const walletAddress =
		'GCTIUQVU4GWDINAEC3B2E2PMVTW45YQ5MMHKQI737YHCVP6UI4ET4G2R';
	const simpleSignerUrl = Cypress.env('VITE_SIMPLE_SIGNER_URL');

	describe('/', () => {
		beforeEach(() => {
			cy.visit('/');
		});
		it('Should be able to connect your wallet', () => {
			cy.window().then((window) => {
				cy.stub(window, 'open')
					.as('connect-wallet')
					.callsFake(() => null);
			});

			cy.getBySel('connect-wallet-btn')
				.should('have.text', 'Connect your Wallet')
				.click();
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
		});

		it('should be able to sign in', () => {
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

			cy.getBySel('connect-wallet-btn')
				.should('have.text', 'Connect your Wallet')
				.click();
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

			cy.getBySel('sign-in-btn').should('have.text', 'Sign In').click();

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
		});

		it('should show an error if the wallet is not connected', () => {
			cy.window().then((window) => {
				cy.stub(window, 'open')
					.as('connect-wallet')
					.callsFake(() => null);
			});

			cy.getBySel('connect-wallet-btn')
				.should('have.text', 'Connect your Wallet')
				.click();
			cy.get('@connect-wallet').should('be.called');

			const connectCancelEvent = new MessageEvent('message', {
				data: {
					type: 'onCancel',
					page: `${simpleSignerUrl}/connect`,
					message: 'The user has canceled the operation',
				},
				origin: simpleSignerUrl,
			});

			cy.window().then((win) => {
				win.dispatchEvent(connectCancelEvent);
			});

			cy.getBySel('toast-container').contains(CONNECT_WALLET_ERROR);
		});

		it('Should show an error if the transaction failed', () => {
			cy.interceptApi(
				`/auth/challenge?publicKey=${walletAddress}`,
				{ method: 'GET' },
				{ fixture: 'auth/challenge-transaction-response.json' },
			);

			cy.window().then((window) => {
				cy.stub(window, 'open')
					.as('connect-wallet')
					.callsFake(() => null);
			});

			cy.getBySel('connect-wallet-btn')
				.should('have.text', 'Connect your Wallet')
				.click();
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

			cy.getBySel('sign-in-btn').should('have.text', 'Sign In').click();

			const signCancelEvent = new MessageEvent('message', {
				data: {
					type: 'onCancel',
					page: `${simpleSignerUrl}/sign`,
					message: 'The user has canceled the operation',
				},
				origin: simpleSignerUrl,
			});

			cy.window().then((win) => {
				win.dispatchEvent(signCancelEvent);
			});

			cy.getBySel('toast-container').contains(SIGN_TRANSACTION_ERROR);
		});
	});

	describe('/auth/sign-up', () => {
		beforeEach(() => {
			cy.visit('/auth/sign-up');
		});
		it('Should be able to sign-up', () => {
			cy.getInputAndType('sign-up-username', username);
			cy.getInputAndType('sign-up-password', password);
			cy.interceptApi(
				'/auth/sign-up',
				{ method: 'POST' },
				{ fixture: 'auth/sign-up.json' },
			).as('sign-up');
			cy.getBySel('sign-up-submit').click();
			cy.wait('@sign-up');
			cy.getBySel('toast-container').contains(SIGN_UP_SUCCESS_MESSAGE);
			cy.getBySel('toast-container').contains(CONFIRMATION_SENT_MESSAGE);
		});
		it('Username field validation', () => {
			cy.validateUsername('sign-up-username', 'form-input-error-username');
		});
		it('Password field validation', () => {
			cy.validatePassword('sign-up-password', 'form-input-error-password');
		});
		it('If the user already exists, it should show an error', () => {
			const errorResponse = {
				error: {
					detail: 'User already signed up',
					source: { pointer: '/api/v1/auth/sign-up' },
					status: '400',
					title: 'Bad Request',
				},
			};
			cy.getInputAndType('sign-up-username', username);
			cy.getInputAndType('sign-up-password', password);
			cy.interceptApi(
				'/auth/sign-up',
				{ method: 'POST' },
				{ body: errorResponse, statusCode: +errorResponse.error.status },
			).as('error-sign-up');
			cy.getBySel('sign-up-submit').click();
			cy.wait('@error-sign-up');
			cy.getBySel('toast-container').contains(errorResponse.error.detail);
		});
	});

	describe('/auth/forgot-password', () => {
		beforeEach(() => {
			cy.visit('/auth/forgot-password');
		});
		it('Should be able to use the forgot password form', () => {
			const successResponse = {
				data: {
					attributes: {
						success: true,
						message: 'Password reset instructions have been sent',
					},
				},
			};
			cy.visit('/auth/forgot-password');
			cy.getInputAndType('forgot-password-username', username);
			cy.interceptApi(
				'/auth/forgot-password',
				{ method: 'POST' },
				{ body: successResponse },
			).as('forgot-password');
			cy.getBySel('forgot-password-submit').click();
			cy.wait('@forgot-password');
			cy.getBySel('toast-container').contains(
				successResponse.data.attributes.message,
			);
		});
		it('Should be able to visit confirm password', () => {
			cy.clickLinkAndVerifyUrl(
				'link-confirm-password',
				'/auth/confirm-password',
			);
		});
		it('Username field validation', () => {
			cy.validateUsername(
				'forgot-password-username',
				'form-input-error-username',
			);
		});
	});

	describe('/auth/confirm-user', () => {
		beforeEach(() => {
			cy.visit('/auth/confirm-user');
		});
		const successResponse = {
			data: {
				attributes: {
					success: true,
					message: 'User successfully confirmed',
				},
			},
		};
		it('Should be able to use the confirm user form', () => {
			cy.getInputAndType('confirm-user-username', username);
			cy.getInputAndType('confirm-user-code', code);
			cy.interceptApi(
				'/auth/confirm-user',
				{ method: 'POST' },
				{ body: successResponse },
			).as('confirm-user');
			cy.getBySel('confirm-user-submit').click();
			cy.wait('@confirm-user');
			cy.getBySel('toast-container').contains(
				successResponse.data.attributes.message,
			);
		});
		it('Should auto confirm the user if a query link is used', () => {
			cy.interceptApi(
				'/auth/confirm-user',
				{ method: 'POST' },
				{ body: successResponse },
			).as('confirm-user');
			cy.visit(`/auth/confirm-user?username=${username}&code=${code}`);
			cy.wait('@confirm-user');
			cy.getBySel('toast-container').contains(
				successResponse.data.attributes.message,
			);
		});
		it('Should be able to visit confirm password', () => {
			cy.clickLinkAndVerifyUrl(
				'link-resend-confirmation-code',
				'/auth/resend-confirmation-code',
			);
		});
		it('Username field validation', () => {
			cy.validateUsername('confirm-user-username', 'form-input-error-username');
		});
		it('Code field validation', () => {
			cy.validateCode('confirm-user-code', 'form-input-error-code');
		});
		it('If the code is invalid, it should show an error', () => {
			const errorResponse = {
				error: {
					detail: 'Incorrect confirmation code',
					source: { pointer: '/api/v1/auth/confirm-user' },
					status: '401',
					title: 'Unauthorized',
				},
			};
			cy.interceptApi(
				'/auth/confirm-user',
				{ method: 'POST' },
				{ body: errorResponse, statusCode: +errorResponse.error.status },
			).as('error-confirm-user');
			cy.getInputAndType('confirm-user-username', username);
			cy.getInputAndType('confirm-user-code', code);
			cy.getBySel('confirm-user-submit').click();
			cy.wait('@error-confirm-user');
			cy.getBySel('toast-container').contains(errorResponse.error.detail);
		});
	});

	describe('/auth/confirm-password', () => {
		beforeEach(() => {
			cy.visit('/auth/confirm-password');
		});
		it('Should be able to use the confirm password form', () => {
			const successResponse = {
				data: {
					attributes: {
						success: true,
						message: 'Your password has been correctly updated',
					},
				},
			};
			cy.getInputAndType('confirm-password-username', username);
			cy.getInputAndType('confirm-password-password', password);
			cy.getInputAndType('confirm-password-code', code);
			cy.interceptApi(
				'/auth/confirm-password',
				{ method: 'POST' },
				{ body: successResponse },
			).as('confirm-password');

			cy.getBySel('confirm-password-submit').click();
			cy.wait('@confirm-password');
			cy.getBySel('toast-container').contains(
				successResponse.data.attributes.message,
			);
		});
		it('Should be able to visit forgot password', () => {
			cy.clickLinkAndVerifyUrl('link-forgot-password', '/auth/forgot-password');
		});
		it('Username field validation', () => {
			cy.validateUsername(
				'confirm-password-username',
				'form-input-error-username',
			);
		});
		it('Password field validation', () => {
			cy.validatePassword(
				'confirm-password-password',
				'form-input-error-password',
			);
		});
		it('Code field validation', () => {
			cy.validateCode('confirm-password-code', 'form-input-error-code');
		});

		it('If the code is invalid, it should show an error', () => {
			const errorResponse = {
				error: {
					detail: 'Incorrect confirmation code',
					source: { pointer: '/api/v1/auth/confirm-password' },
					status: '401',
					title: 'Unauthorized',
				},
			};
			cy.interceptApi(
				'/auth/confirm-password',
				{ method: 'POST' },
				{ body: errorResponse, statusCode: +errorResponse.error.status },
			).as('error-confirm-password');
			cy.getInputAndType('confirm-password-username', username);
			cy.getInputAndType('confirm-password-password', password);
			cy.getInputAndType('confirm-password-code', code);
			cy.getBySel('confirm-password-submit').click();
			cy.wait('@error-confirm-password');
			cy.getBySel('toast-container').contains(errorResponse.error.detail);
		});
	});

	describe('/auth/resend-confirmation-code', () => {
		beforeEach(() => {
			cy.visit('/auth/resend-confirmation-code');
		});
		it('Should be able to use the resend confirmation code form', () => {
			const successResponse = {
				data: {
					attributes: {
						success: true,
						message: 'A new code has been sent to your e-mail address',
					},
				},
			};
			cy.getInputAndType('resend-confirmation-code-username', username);
			cy.interceptApi(
				'/auth/resend-confirmation-code',
				{ method: 'POST' },
				{ body: successResponse },
			).as('resend-confirmation-code');
			cy.getBySel('resend-confirmation-code-submit').click();
			cy.wait('@resend-confirmation-code');
			cy.getBySel('toast-container').contains(
				successResponse.data.attributes.message,
			);
		});
		it('Should be able to visit sign in', () => {
			cy.clickLinkAndVerifyUrl('link-confirm-user', '/auth/confirm-user');
		});
		it('Username field validation', () => {
			cy.validateUsername(
				'resend-confirmation-code-username',
				'form-input-error-username',
			);
		});
		it('If the user does not exist, it should show an error', () => {
			const errorResponse = {
				error: {
					detail: `${username} was not found`,
					source: { pointer: '/api/v1/auth/resend-confirmation-code' },
					status: '404',
					title: 'Username Not Found',
				},
			};
			cy.getInputAndType('resend-confirmation-code-username', username);
			cy.interceptApi(
				'/auth/resend-confirmation-code',
				{ method: 'POST' },
				{ body: errorResponse, statusCode: +errorResponse.error.status },
			).as('error-resend-confirmation-code');
			cy.getBySel('resend-confirmation-code-submit').click();
			cy.wait('@error-resend-confirmation-code');
			cy.getBySel('toast-container').contains(errorResponse.error.detail);
		});
	});
	describe('/auth/sign-out', () => {
		it('After a successful sign in, should be able to sign out', () => {
			cy.signIn();
			cy.getBySel('sign-out').click();
			cy.url().should('eq', Cypress.config('baseUrl') + '/');
			cy.getBySel('toast-container').contains(SIGN_OUT_SUCCESS_MESSAGE);
		});
	});
});
