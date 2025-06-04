import { Outlet } from "react-router-dom";
import { NavBarNetworks } from "./AdmNavNetworks";

export const LayoutNetworks = () => {
    return (
        <div className="bg-background h-screen">
            <NavBarNetworks />
            <Outlet />
        </div>
    );
} 