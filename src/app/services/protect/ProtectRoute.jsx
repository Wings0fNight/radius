import React from "react";
import { Navigate, Outlet} from "react-router-dom";

const ProtectRoute = ({ children }) => {
	const isAuthenticated = JSON.parse(localStorage.getItem("auth"));
	if (!isAuthenticated) {
		return <Navigate to="/auth" replace/>;
	}
	if (isAuthenticated === true) {
		return <Outlet/>;
	}
};

export default ProtectRoute;