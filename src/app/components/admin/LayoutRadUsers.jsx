import { Outlet } from "react-router-dom";
import { NavBarRadUsers } from "./AdmNavRadUsers";

export const LayoutRadUsers = () => {
	return (
		<div className="bg-background h-screen">
			<NavBarRadUsers />
			<Outlet />
		</div>
	);
} 