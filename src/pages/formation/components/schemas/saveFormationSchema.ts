import * as yup from 'yup';

import { FORMATION_NAME_REQUIRED } from './schema-errors';

export const saveFormationSchema = yup.object({
	formationName: yup.string().required(FORMATION_NAME_REQUIRED),
});
