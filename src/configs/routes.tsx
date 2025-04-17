import { RouteObject } from 'react-router-dom';

import AuthLayout from '@/layouts/AuthLayout';
import PrivateLayout from '@/layouts/PrivateLayout';
import About from '@/pages/about/About';
import Auctions from '@/pages/auction/Auctions';
import ConfirmPassword from '@/pages/auth/ConfirmPassword';
import ConfirmUser from '@/pages/auth/ConfirmUser';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResendConfirmationCode from '@/pages/auth/ResendConfirmationCode';
import SignIn from '@/pages/auth/SignIn';
import SignOut from '@/pages/auth/SignOut';
import SignUp from '@/pages/auth/SignUp';
import Users from '@/pages/example-users/Users';
import Home from '@/pages/home/Home';
import TransferMarket from '@/pages/transfer-market/TransferMarket';

export const authRoutes: RouteObject[] = [
	{
		element: <AuthLayout />,
		children: [
			{
				path: '/auth/sign-in',
				element: <SignIn />,
			},
			{
				path: '/auth/sign-up',
				element: <SignUp />,
			},
			{
				path: '/auth/confirm-user',
				element: <ConfirmUser />,
			},
			{
				path: '/auth/confirm-password',
				element: <ConfirmPassword />,
			},
			{
				path: '/auth/resend-confirmation-code',
				element: <ResendConfirmationCode />,
			},
			{
				path: '/auth/forgot-password',
				element: <ForgotPassword />,
			},
		],
	},
];

export const privateRoutes: RouteObject[] = [
	{
		element: <PrivateLayout />,
		children: [
			{
				path: '/about',
				element: <About />,
			},
			{
				path: '/transfer-market',
				element: <TransferMarket />,
			},
			{
				path: '/auctions',
				element: <Auctions />,
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
		path: '/users',
		element: <Users />,
	},
	{
		path: '/auth/sign-out',
		element: <SignOut />,
	},
];
