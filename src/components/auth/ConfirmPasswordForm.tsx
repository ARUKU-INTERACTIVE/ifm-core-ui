import { Formik } from 'formik';
import { Link } from 'react-router-dom';

import AuthContainer from './AuthContainer';
import AuthForm from './AuthForm';
import AuthInput from './AuthInput';
import AuthOr from './AuthOr';
import AuthSub from './AuthSub';
import AuthSubmit from './AuthSubmit';
import AuthTitle from './AuthTitle';
import { confirmPasswordSchema } from './schemas/confirm-password.schema';

type PropTypes = {
	handleSubmit: (
		username: string,
		newPassword: string,
		code: string,
	) => Promise<void>;
	loading: boolean;
};
export default function ConfirmPasswordForm({
	handleSubmit,
	loading,
}: PropTypes) {
	const initialValues = {
		username: '',
		code: '',
		password: '',
	};

	return (
		<AuthContainer>
			<Formik
				initialValues={initialValues}
				validationSchema={confirmPasswordSchema}
				onSubmit={({ username, password, code }) =>
					handleSubmit(username, password, code.toString())
				}
			>
				{({ errors, touched }) => (
					<AuthForm>
						<AuthTitle>Confirm password</AuthTitle>
						<AuthInput
							name="username"
							label="Username"
							type="email"
							placeholder="user@example.com"
							error={!!errors.username}
							touched={touched.username}
							data-test="confirm-password-username"
						/>
						<AuthInput
							name="password"
							label="New Password"
							type="password"
							placeholder="********"
							error={!!errors.password}
							touched={touched.password}
							data-test="confirm-password-password"
						/>
						<AuthInput
							name="code"
							label="Code"
							type="tel"
							placeholder="123456"
							error={!!errors.code}
							touched={touched.code}
							data-test="confirm-password-code"
						/>
						<AuthSubmit loading={loading} data-test="confirm-password-submit" />
						<AuthOr />
						<AuthSub>
							<p>
								Don't have a code?{' '}
								<Link
									className="font-medium text-blue-500"
									to="/auth/forgot-password"
									data-test="link-forgot-password"
								>
									Click here
								</Link>
							</p>
							<p>
								Already confirmed?{' '}
								<Link
									className="font-medium text-blue-500"
									to="/auth/sign-in"
									data-test="link-sign-in"
								>
									Sign in
								</Link>
							</p>
						</AuthSub>
					</AuthForm>
				)}
			</Formik>
		</AuthContainer>
	);
}
