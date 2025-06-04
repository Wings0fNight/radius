import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider";
import ProtectRoute from './services/protect/ProtectRoute';
import AdminProtect from './services/protect/AdminProtect';
import ChPassProtect from './services/protect/ChPasswdProtect';
import { Layout } from './components/Layout';
import { LayoutRadUsers } from './components/admin/LayoutRadUsers';
import { LayoutNetworks } from './components/admin/LayoutNetworks'
import { LayoutPermisions } from './components/admin/LayoutPermisions';

import AuthForm from './pages/AuthForm';
import { Home } from './pages/HomePage';
import ChangePass from './pages/ChangePass';
import RadUsers from './pages/admin/RadUsers'
import RadRobots from './pages/admin/RadRobots'
import RadGroups from './pages/admin/RadGroups'
import City from './pages/admin/City'
import Networks from './pages/admin/Networks'
import Responsibilities from './pages/admin/Responsibilities';
import TrustedIps from './pages/admin/TrustedIps'
import Site from './pages/admin/Site'
import TacacsGroups from './pages/admin/TacacsGroups'
import Permisions from './pages/admin/Permisions'
import TESTPAGE from './pages/TESTPAGE';

import './styles/App.css';

const App = () => {
	return (
		<ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
			<Router>
				<Routes>
					<Route path="/auth" element={<AuthForm />} />
					<Route element={<ProtectRoute />}>
						<Route element={<Layout />}>
							<Route index element={<Home />} />
							<Route element={<ChPassProtect />}>
								<Route path="change-password" element={<ChangePass />} />
							</Route>

							<Route element={<LayoutRadUsers />}>
								<Route path="admins-radusers" element={<RadUsers />} />
								<Route path="admins-radrobots" element={<RadRobots />} />
								<Route path="admins-radgroups" element={<RadGroups />} />
							</Route>
							<Route element={<LayoutNetworks />}>
								<Route path="admins-networks" element={<Networks />} />
								<Route path="admins-responsibilities" element={<Responsibilities />} />
								<Route path="admins-trustedips" element={<TrustedIps />} />
								<Route path="admins-sites" element={<Site />} />
							</Route>

							<Route path='admins-city' element={<City />} />

							<Route element={<LayoutPermisions />}>
								<Route path="admins-tacacsgroups" element={<TacacsGroups />} />
								<Route path="admins-permisions" element={<Permisions />} />
							</Route>

							<Route path='test' element={<TESTPAGE />} />

							{/* <Route path="admins-raduserssettings" element={<AdminUsers/>} /> */}
							<Route element={<AdminProtect />}>
								
							</Route>
						</Route>
					</Route>
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</Router>
		</ThemeProvider>
	);
};
export { App };