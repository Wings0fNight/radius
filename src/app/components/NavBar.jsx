import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { auth } from "../services/auth/AutoCheckAuth"
import { logout } from "../services/auth/LogoutApi"
import { Tooltip,TooltipTrigger,TooltipContent } from "@/components/ui/tooltip" 
import { useNavigate } from 'react-router-dom'
import { Sun, Moon, Home, KeySquare, UserPen, Building2, LogOut, Network, TestTube, EarthLock} from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import siteIcon from '../assets/icon-bar.svg'
import siteIconBlack from '../assets/icon-bar-black.svg'
  
const NavItem = ({ 
	icon: Icon, 
	label, 
	onClick, 
	isActive,
	iconSize = 24,
  }) => (
	<Tooltip>
		<TooltipTrigger asChild>
			<Button
				variant="ghost"
				onClick={onClick}
				className={`w-12 h-12 rounded-lg ${isActive ? 'bg-background-accent' : ''}`}
			>
				<Icon 
					size={iconSize}
					className="w-[var(--icon-size)] h-[var(--icon-size)]" 
					style={{ '--icon-size': `${iconSize}px` }}
				/>				
				<span className="sr-only">{label}</span>
			</Button>
		</TooltipTrigger>
		<TooltipContent side="right" className="text-foreground">
			{label}
		</TooltipContent>
	</Tooltip>
)
  
export default function NavBar() {
	const { theme, setTheme } = useTheme()
	const navigate = useNavigate()
	const [error, setError] = useState(null);
	const userData = JSON.parse(localStorage.getItem("userData") || "{}")
  
	const handleAuthCheck = async (path) => {
		try {
			const response = await auth(userData.token)
			if (response.data.auth === true) navigate(path)
			else {
				localStorage.clear()
				navigate('/auth')
			}
		} catch {
			localStorage.clear()
			navigate('/auth')
		}
	}

	const handleLogout = async () => {
		try {
			const response = await logout(userData.token);
			if (response.data.auth === false) {
				localStorage.clear();
				navigate('/auth');
			}else {
				setError("Что-то пошло не так :(");
			}
		} catch {
			localStorage.clear();
			navigate('/auth');
		}
	};
  
	return (
		<nav className="flex h-screen w-20 flex-col items-center border-r-2 border-border bg-background pb-5">
			<div className="h-[7.1%] w-full border-b-2 border-border flex">
				{theme === 'dark' ? <img src={siteIcon} className='w-[70%] m-auto items-center' alt="Site Logo" /> : <img src={siteIconBlack} className='w-[70%] m-auto items-center' alt="Site Logo" />}
			</div>
	
			<div className="flex flex-1 flex-col items-center gap-2 mt-2">
				<NavItem
					icon={Home}
					label="Home"
					onClick={() => handleAuthCheck('/')}
					isActive={location.pathname === '/'}
				/>
				
				<NavItem
					icon={KeySquare}
					label="Change Password"
					onClick={() => handleAuthCheck('/change-password')}
					isActive={location.pathname === '/change-password'}
				/>

				<NavItem
					icon={UserPen}
					label="Radius Users"
					onClick={() => handleAuthCheck('/admins-radusers')}
					isActive={location.pathname === '/admins-radusers'}
				/>

				<NavItem
					icon={Network}
					label="Network Management"
					onClick={() => handleAuthCheck('/admins-networks')}
					isActive={location.pathname === '/admins-networks'}
				/>
					
				<NavItem
					icon={Building2}
					label="City Management"
					onClick={() => handleAuthCheck('/admins-city')}
					isActive={location.pathname === '/admins-city'}
				/>

				<NavItem
					icon={EarthLock}
					label="Permisions"
					onClick={() => handleAuthCheck('/admins-tacacsgroups')}
					isActive={location.pathname === '/admins-tacacsgroups'}
				/>
	
				<NavItem
					icon={TestTube}
					label="Lab Management"
					onClick={() => handleAuthCheck('/test')}
					isActive={location.pathname === '/test'}
				/>
			</div>
	
			<div className="flex flex-col items-center gap-2">
				<Tooltip>
					<TooltipTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
						className="h-12 w-12 rounded-lg"
					>
						{theme === 'light' ? (
						<Moon className="h-5 w-5" />
						) : (
						<Sun className="h-5 w-5" />
						)}
						<span className="sr-only">Toggle theme</span>
					</Button>
					</TooltipTrigger>
					<TooltipContent side="right">
					<p className="text-foreground">Toggle theme</p>
					</TooltipContent>
				</Tooltip>
	
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							onClick={() => {
								handleLogout(userData.token)
								localStorage.clear()
								navigate('/auth')
							}}
							className="h-12 w-12 rounded-lg flex flex-1 flex-col items-center"
						>
							<LogOut size={20} />
							<span className="sr-only">Logout</span>
						</Button>
					</TooltipTrigger>
					<TooltipContent side="right">
						<p className="text-foreground">Logout</p>
					</TooltipContent>
				</Tooltip>
			</div>
		</nav>
	)
}