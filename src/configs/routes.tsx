import { RouteObject } from 'react-router-dom';

import AuthLayout from '@/layouts/AuthLayout';
import PrivateLayout from '@/layouts/PrivateLayout';
import Auctions from '@/pages/auction/Auctions';
import SignIn from '@/pages/auth/SignIn';
import SignOut from '@/pages/auth/SignOut';
import Home from '@/pages/home/Home';
import Team from '@/pages/team/Team';
import TransferMarket from '@/pages/transfer-market/TransferMarket';

export const authRoutes: RouteObject[] = [
	{
		element: <AuthLayout />,
		children: [
			{
				path: '/auth/sign-in',
				element: <SignIn />,
			},
		],
	},
];

export const privateRoutes: RouteObject[] = [
	{
		element: <PrivateLayout />,
		children: [
			{
				path: '/transfer-market',
				element: <TransferMarket />,
			},
			{
				path: '/auctions',
				element: <Auctions />,
			},
			{
				path: '/team',
				element: <Team />,
			},
		],
	},
];

export const publicRoutes: RouteObject[] = [
	{
		index: true,
		path: '/',
		element: <Home />,
	},
	{
		path: '/auth/sign-out',
		element: <SignOut />,
	},
];
