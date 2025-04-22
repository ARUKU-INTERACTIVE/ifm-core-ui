import { useFormikContext } from 'formik';
import { useEffect, useState } from 'react';

import { ShowFilePreview } from './ShowFilePreview';

export type FileInputProps<T> = {
	name: keyof T;
	label: string;
	dataTest: string;
	helpText?: string;
	multiple?: boolean;
	showPreview?: boolean;
	filePreviewClassName?: string;
};

const FileInput = <T,>({
	name,
	label,
	dataTest,
	multiple = false,
	helpText,
	filePreviewClassName,
	showPreview = true,
}: FileInputProps<T>) => {
	const { setFieldValue, values, errors, touched } = useFormikContext<T>();
	const [previewUrl, setPreviewUrl] = useState<string[]>([]);

	const fileFromForm = values[name] as FileList | string | null;

	useEffect(() => {
		setPreviewUrl([]);
		if (fileFromForm) {
			if (typeof fileFromForm === 'string') {
				setPreviewUrl([fileFromForm as string]);
			} else if (fileFromForm instanceof FileList && fileFromForm.length > 0) {
				for (const file of fileFromForm) {
					const fileReader = new FileReader();
					fileReader.onload = () => {
						setPreviewUrl((prev) => [...prev, fileReader.result as string]);
					};
					fileReader.readAsDataURL(file);
				}
			}
		} else {
			setPreviewUrl([]);
		}
	}, [fileFromForm]);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.currentTarget.files;
		if (files) {
			setFieldValue(name as string, files);
		}
	};

	return (
		<div className="form-group">
			<label className="mb-2 py-4 font-bold">{label}</label>

			<input
				className="form-control mb-4"
				type="file"
				multiple={multiple}
				accept=".jpeg, .jpg, .png, .pdf"
				onChange={handleFileChange}
				data-test={dataTest}
			/>

			{helpText && (
				<small className="text-muted font-italic mb-4 d-block">
					{helpText}
				</small>
			)}

			{errors[name] && touched[name] && (
				<div className="alert alert-danger" data-test="form-input-error">
					{errors[name] as string}
				</div>
			)}

			{showPreview &&
				previewUrl &&
				previewUrl.map((url, index) => (
					<ShowFilePreview
						previewUrl={url}
						key={url + index}
						className={filePreviewClassName}
						title={label}
					/>
				))}
		</div>
	);
};

export default FileInput;
