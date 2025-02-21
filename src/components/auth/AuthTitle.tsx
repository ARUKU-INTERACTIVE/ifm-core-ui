import { IReactChildrenProps } from '@/interfaces/IReactChildren';

export default function AuthTitle({ children }: IReactChildrenProps) {
	return <h1 className="text-3xl font-bold font-sans py-4">{children}</h1>;
}
