import { createBrowserRouter } from 'react-router-dom';

import { authRoutes, privateRoutes, publicRoutes } from './routes';

import Root from '@pages/Root';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Root />,
		children: [...publicRoutes, ...authRoutes, ...privateRoutes],
	},
]);

export default router;
