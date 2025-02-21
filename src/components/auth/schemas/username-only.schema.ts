import * as yup from 'yup';

import { USERNAME_INVALID, USERNAME_REQUIRED } from './schema-errors';

export const usernameOnlySchema = yup.object({
	username: yup.string().email(USERNAME_INVALID).required(USERNAME_REQUIRED),
});
