import Loading from '../ui/Loading';

interface IListWrapperProps {
	isLoading: boolean;
	shouldShowList: boolean;
	listComponent: () => JSX.Element;
	emptyText: string;
}

export const ListWrapper = ({
	isLoading,
	emptyText,
	listComponent,
	shouldShowList,
}: IListWrapperProps) => {
	if (isLoading) {
		return <Loading />;
	}
	if (shouldShowList) {
		return listComponent();
	}
	return (
		<div className="flex justify-center items-center mt-6">
			<p className="text-gray-500" data-test="no-auctions-found">
				{emptyText}
			</p>
		</div>
	);
};
