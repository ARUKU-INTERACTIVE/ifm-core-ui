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
export default function ForgotPasswordForm({
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
						<AuthTitle>Forgot Password</AuthTitle>
						<AuthInput
							name="username"
							label="Username"
							type="email"
							placeholder="user@example.com"
							error={!!errors.username}
							touched={touched.username}
							data-test="forgot-password-username"
						/>
						<AuthSubmit loading={loading} data-test="forgot-password-submit" />
						<AuthOr />
						<AuthSub>
							<p>
								Already have your code?{' '}
								<Link
									className="font-medium text-blue-500"
									to="/auth/confirm-password"
									data-test="link-confirm-password"
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
