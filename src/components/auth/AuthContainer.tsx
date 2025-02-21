import { IReactChildrenProps } from '@/interfaces/IReactChildren';

export default function AuthContainer({ children }: IReactChildrenProps) {
	return (
		<div className="max-w-md mx-auto shadow-none sm:shadow-md  my-8 p-10 px-8 w-full">
			{children}
		</div>
	);
}
