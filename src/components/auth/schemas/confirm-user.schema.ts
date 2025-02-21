import * as yup from 'yup';

import {
	CODE_MIN_LENGTH,
	CODE_REQUIRED,
	CODE_TYPE,
	USERNAME_INVALID,
	USERNAME_REQUIRED,
} from './schema-errors';

export const confirmUserSchema = yup.object({
	username: yup.string().email(USERNAME_INVALID).required(USERNAME_REQUIRED),
	code: yup
		.string()
		.matches(/^[0-9]+$/, CODE_TYPE)
		.min(6, CODE_MIN_LENGTH)
		.required(CODE_REQUIRED),
});
