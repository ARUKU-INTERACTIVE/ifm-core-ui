import { Formik } from 'formik';
import { Link } from 'react-router-dom';

import AuthContainer from './AuthContainer';
import AuthForm from './AuthForm';
import AuthInput from './AuthInput';
import AuthOr from './AuthOr';
import AuthSub from './AuthSub';
import AuthSubmit from './AuthSubmit';
import AuthTitle from './AuthTitle';
import { usernameOnlySchema } from './schemas/username-only.schema';

type PropTypes = {
	handleSubmit: (username: string) => Promise<void>;
	loading: boolean;
};
export default function ResendConfirmationCodeForm({
	handleSubmit,
	loading,
}: PropTypes) {
	const initialValues = {
		username: '',
	};
	return (
		<AuthContainer>
			<Formik
				initialValues={initialValues}
				validationSchema={usernameOnlySchema}
				onSubmit={({ username }) => handleSubmit(username)}
			>
				{({ errors, touched }) => (
					<AuthForm>
						<AuthTitle>Resend code</AuthTitle>
						<AuthInput
							name="username"
							label="Username"
							type="email"
							placeholder="user@example.com"
							error={!!errors.username}
							touched={touched.username}
							data-test="resend-confirmation-code-username"
						/>
						<AuthSubmit
							loading={loading}
							data-test="resend-confirmation-code-submit"
						/>
						<AuthOr />
						<AuthSub>
							<p>
								Already have your code?{' '}
								<Link
									className="font-medium text-blue-500"
									to="/auth/confirm-user"
									data-test="link-confirm-user"
								>
									Click here
								</Link>
							</p>
						</AuthSub>
					</AuthForm>
				)}
			</Formik>
		</AuthContainer>
	);
}
