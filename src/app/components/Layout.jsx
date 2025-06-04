import { Outlet } from "react-router-dom";
import NavBar  from "./NavBar";

export const Layout = () => {
	return (
		<div className="flex h-screen bg-background">
			<NavBar />
			<div className="flex-1">
				<Outlet />
			</div>
		</div>
	);
} 