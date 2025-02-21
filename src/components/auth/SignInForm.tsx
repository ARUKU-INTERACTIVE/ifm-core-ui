import { Formik } from 'formik';
import { Link } from 'react-router-dom';

import AuthContainer from './AuthContainer';
import AuthForm from './AuthForm';
import AuthInput from './AuthInput';
import AuthOr from './AuthOr';
import AuthSub from './AuthSub';
import AuthSubmit from './AuthSubmit';
import AuthTitle from './AuthTitle';
import { signInSchema } from './schemas/sign-in.schema';

type PropTypes = {
	handleSubmit: (username: string, password: string) => Promise<void>;
	loading: boolean;
};
export default function SignInForm({ handleSubmit, loading }: PropTypes) {
	const initialValues = {
		username: '',
		password: '',
	};

	return (
		<AuthContainer>
			<Formik
				initialValues={initialValues}
				validationSchema={signInSchema}
				onSubmit={({ username, password }) => handleSubmit(username, password)}
			>
				{({ errors, touched }) => (
					<AuthForm>
						<AuthTitle>Sign In</AuthTitle>
						<AuthInput
							label="Username"
							name="username"
							type="email"
							placeholder="user@example.com"
							error={!!errors.username}
							touched={touched.username}
							data-test="sign-in-username"
						/>
						<AuthInput
							label="Password"
							name="password"
							type="password"
							placeholder="********"
							error={!!errors.password}
							touched={touched.password}
							data-test="sign-in-password"
						/>
						<AuthSubmit loading={loading} data-test="sign-in-submit" />
						<AuthOr />
						<AuthSub>
							<p>
								Forgot your password?{' '}
								<Link
									className="font-medium text-blue-500"
									to="/auth/forgot-password"
									data-test="link-forgot-password"
								>
									Click here
								</Link>
							</p>
							<p>
								Don't have an account?{' '}
								<Link
									className="font-medium text-blue-500"
									to="/auth/sign-up"
									data-test="link-sign-up"
								>
									Sign up
								</Link>
							</p>
							<p>
								Account not confirmed?{' '}
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
