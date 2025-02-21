import { IReactChildrenProps } from '@/interfaces/IReactChildren';

export default function AuthSub({ children }: IReactChildrenProps) {
	return (
		<div className="text-xs text-gray-500 py-1 text-center">{children}</div>
	);
}
