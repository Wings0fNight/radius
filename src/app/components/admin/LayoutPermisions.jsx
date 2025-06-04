import { Outlet } from "react-router-dom";
import { NavBarPepmisions } from "./AdmNavPermisions";

export const LayoutPermisions = () => {
    return (
        <div className="bg-background h-screen">
            <NavBarPepmisions />
            <Outlet />
        </div>
    );
} 