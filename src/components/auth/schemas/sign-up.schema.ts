import * as yup from 'yup';

import {
	PASSWORD_LOWERCASE,
	PASSWORD_MAX_LENGTH,
	PASSWORD_MIN_LENGTH,
	PASSWORD_NUMBER,
	PASSWORD_REQUIRED,
	PASSWORD_SPECIAL,
	PASSWORD_UPPERCASE,
	USERNAME_INVALID,
	USERNAME_REQUIRED,
} from './schema-errors';

export const signUpSchema = yup.object({
	username: yup.string().email(USERNAME_INVALID).required(USERNAME_REQUIRED),
	password: yup
		.string()
		.required(PASSWORD_REQUIRED)
		.min(8, PASSWORD_MIN_LENGTH)
		.max(50, PASSWORD_MAX_LENGTH)
		.matches(/[a-z]/, PASSWORD_LOWERCASE)
		.matches(/[A-Z]/, PASSWORD_UPPERCASE)
		.matches(/[0-9]/, PASSWORD_NUMBER)
		.matches(/\W/, PASSWORD_SPECIAL),
});
