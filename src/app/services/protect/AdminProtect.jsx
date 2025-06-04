import React from "react";
import { Navigate, Outlet } from "react-router-dom";


const AdminProtect = ({ children }) => {
	const isAuthenticated = JSON.parse(localStorage.getItem("auth"));
	if (!isAuthenticated) {
		return <Navigate to="/auth" replace/>;
	}

	const userData = JSON.parse(localStorage.getItem("userData"));

	if (userData.XXX !== "admin") {														//FIXME: ПОСЛЕ ПОЛУЧЕНИЯ ДАННЫХ ОБ АДМИНЕ ДОБАВИТЬ!!!
		return <Navigate to="/" replace/>;
	} else {
		return < Outlet />;
	}
};

export default AdminProtect;