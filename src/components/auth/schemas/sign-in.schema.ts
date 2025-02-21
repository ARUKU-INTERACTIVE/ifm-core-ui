import * as yup from 'yup';

import {
	PASSWORD_REQUIRED,
	USERNAME_INVALID,
	USERNAME_REQUIRED,
} from './schema-errors';

export const signInSchema = yup.object({
	username: yup.string().email(USERNAME_INVALID).required(USERNAME_REQUIRED),
	password: yup.string().required(PASSWORD_REQUIRED),
});
