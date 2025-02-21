import Button from './Button';

type PropTypes = {
	connected: boolean;
};
export default function Action({ connected }: PropTypes) {
	if (connected) {
		return (
			<Button data-test="sign-out" to="/auth/sign-out" innerText="Sign Out" />
		);
	}
	return <Button data-test="sign-in" to="/auth/sign-in" innerText="Sign In" />;
}
