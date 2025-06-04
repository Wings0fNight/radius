import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../services/auth/AutoCheckAuth";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipTrigger,
	TooltipContent,
} from "@/components/ui/tooltip";
import { Users, FileKey } from "lucide-react";

const NavItem = ({ icon: Icon, label, onClick, isActive }) => (
	<Tooltip>
		<TooltipTrigger asChild>
			<Button
				variant={"ghost"}
				onClick={onClick}
				className={`w-12 h-12 ml-2 mr-2 rounded-lg ${
					isActive ? "bg-background-accent" : ""
				}`}
			>
				<Icon />
			</Button>
		</TooltipTrigger>
		<TooltipContent className="text-foreground">{label}</TooltipContent>
	</Tooltip>
);

export function NavBarPepmisions() {
	const navigate = useNavigate();
	const userData = JSON.parse(localStorage.getItem("userData"));

	const handleAuthChack = async (path) => {
		try {
			const response = await auth(userData.token);
			if (response.data.auth === true) {
				navigate(path);
			} else {
				localStorage.clear();
				navigate("/auth");
			}
		} catch {
			localStorage.clear();
			navigate("/auth");
		}
	};

	return (
		<nav className="flex h-[7%] w-full flex-col items-center border-b-2 border-border  bg-background py-4">
			<ul className="flex flex-wrap mb-px text-sm font-medium">
				<NavItem
					icon={Users}
					label="Tacacs Groups"
					onClick={() => handleAuthChack("/admins-tacacsgroups")}
					isActive={location.pathname === "/admins-tacacsgroups"}
				/>
				<NavItem
					icon={FileKey}
					label="Permision level"
					onClick={() => handleAuthChack("/admins-permisions")}
					isActive={location.pathname === "/admins-permisions"}
				/>
			</ul>
		</nav>
	);
}
