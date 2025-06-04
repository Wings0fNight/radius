import React from "react";
import { Navigate, Outlet} from "react-router-dom";

const ChPassProtect = ({ children }) => {
    const isAuthenticated = JSON.parse(localStorage.getItem("auth"));
    if (!isAuthenticated) {
        return <Navigate to="/auth" replace/>;
    }

	const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData.modules.includes('radius_password')) {
        return <Outlet />;
    } else {
        return <Navigate to="/" replace/>;
    }
};

export default ChPassProtect;