declare namespace Cypress {
	interface Chainable {
		getBySel(
			selector: string,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			args?: any,
		): Chainable<JQuery<HTMLElement>>;
		getBySelLike(
			selector: string,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			args?: any,
		): Chainable<JQuery<HTMLElement>>;
		clickLinkAndVerifyUrl(
			selector: string,
			url: string,
		): Chainable<JQuery<HTMLElement>>;
		getInputAndType(
			selector: string,
			text: string,
		): Chainable<JQuery<HTMLElement>>;
		interceptApi(
			endpoint: string,
			routeOptions: RouteMatcher,
			responseOptions: RouteHandler,
		): Chainable<JQuery<HTMLElement>>;
		validateUsername(inputSelector: string, errorSelector: string);
		validatePassword(inputSelector: string, errorSelector: string);
		validateCode(inputSelector: string, errorSelector: string);
		signIn(): Chainable<JQuery<HTMLElement>>;
		deleteCookie(cookieName: string);
	}
}
