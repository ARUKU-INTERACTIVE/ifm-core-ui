import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import NavBar from '@/components/navbar/NavBar';
import { AuthProvider } from '@/context/AuthContext';

export default function Root() {
	return (
		<>
			<AuthProvider>
				<NavBar />
				<div id="pages" className="flex flex-col flex-1">
					<Outlet />
				</div>
			</AuthProvider>
			<div data-test="toast-container">
				<ToastContainer data-test="toast-container" />
			</div>
		</>
	);
}
