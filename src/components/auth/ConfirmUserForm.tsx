import { Formik } from 'formik';
import { Link } from 'react-router-dom';

import AuthContainer from './AuthContainer';
import AuthForm from './AuthForm';
import AuthInput from './AuthInput';
import AuthOr from './AuthOr';
import AuthSub from './AuthSub';
import AuthSubmit from './AuthSubmit';
import AuthTitle from './AuthTitle';
import { confirmUserSchema } from './schemas/confirm-user.schema';

import { useConfirmationLink } from '@/hooks/auth/useConfirmationLink';

type PropTypes = {
	handleSubmit: (username: string, code: string) => Promise<void>;
	loading: boolean;
};
export default function ConfirmUserForm({ handleSubmit, loading }: PropTypes) {
	useConfirmationLink();
	const initialValues = {
		username: '',
		code: '',
	};

	return (
		<AuthContainer>
			<Formik
				initialValues={initialValues}
				validationSchema={confirmUserSchema}
				onSubmit={({ username, code }) =>
					handleSubmit(username, code.toString())
				}
			>
				{({ errors, touched }) => (
					<AuthForm>
						<AuthTitle>Confirm user</AuthTitle>
						<AuthInput
							name="username"
							label="Username"
							type="email"
							placeholder="user@example.com"
							error={!!errors.username}
							touched={touched.username}
							data-test="confirm-user-username"
						/>
						<AuthInput
							name="code"
							label="Code"
							type="tel"
							placeholder="123456"
							error={!!errors.code}
							touched={touched.code}
							data-test="confirm-user-code"
						/>
						<AuthSubmit loading={loading} data-test="confirm-user-submit" />
						<AuthOr />
						<AuthSub>
							<p>
								Didn't receive your code?{' '}
								<Link
									className="font-medium text-blue-500"
									to="/auth/resend-confirmation-code"
									data-test="link-resend-confirmation-code"
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
