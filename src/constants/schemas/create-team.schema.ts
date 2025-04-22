import * as yup from 'yup';

import {
	TEAM_LOGO_REQUIRED_ERROR,
	TEAM_NAME_REQUIRED_ERROR,
} from '../errors/team.errors';

export const createTeamSchema = yup.object({
	logoUri: yup.string().required(TEAM_LOGO_REQUIRED_ERROR),
	name: yup.string().required(TEAM_NAME_REQUIRED_ERROR),
});
