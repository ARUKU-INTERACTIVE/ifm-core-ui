import * as yup from 'yup';

export const mintPlayerSchema = yup.object({
	name: yup.string().required('Name is required'),
	description: yup.string().required('Description is required'),
	file: yup
		.mixed<FileList>()
		.required('A file is required')
		.test('required', 'A file is required', (file) => {
			return file && file.length > 0 && Boolean(file[0]);
		}),
});
