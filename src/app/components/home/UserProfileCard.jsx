import { Mail, UserCheck, KeySquare } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function UserProfile() {
	const { theme } = useTheme();

	const getRandomInt = (max) => {
		return Math.floor(Math.random() * max);
	}

	const maxConnections = 200;												//FIXME: После получения от сервера - обновить на получение из localstorage
	const userUsedConnections = getRandomInt(201);											//FIXME: После получения от сервера - обновить на получение из localstorage
	const remainingConnections = maxConnections - userUsedConnections;
    const percentage = (remainingConnections / maxConnections) * 100;

	const getColor = (percent) => {
		if (percent < 25) return '#EF4444';
		if (percent < 50) return '#F59E0B';
		if (percent < 75) return '#edff29';
		return '#10B981';
	};

	const getColorText = () => {
		return theme === 'dark' ? '#FFFFFF' : '#1F2937';
	};
	const userData = JSON.parse(localStorage.getItem("userData"));
	return (
		<div className='grid grid-cols-1 md:grid-cols-2 gap-8 w-full items-stretch pl-10 pr-10 '>
			<div className="h-full max-w-[95%] p-6 bg-card border border-border rounded-lg mb-10 flex flex-col shadow-md">
				<h1 className='text-3xl font-black text-left pl-3'>
					Привет, {userData.displayName}
				</h1>
				<div className="flex flex-col pt-2">
					<div className='relative'>
						< Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2" />
						<p className='text-left pl-10'>{userData.email}</p>
					</div>
					<div className='relative'>
						<UserCheck size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2" />
						<p className='text-left pl-10'>Учетная запись <span className='font-bold'>{userData.uname}</span> активна до: <span className='font-bold text-red-600'> ДАТА </span></p>
					</div>
					<div className='relative'>
						<KeySquare size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2" />
						<p className='text-left pl-10'>Пароль действителен до: <span className='font-bold text-red-600'> ДАТА </span></p>
					</div>
				</div>
			</div>
			<div className="h-full max-w-[95%] p-6 bg-card text-foregraund border border-border rounded-lg flex flex-col items-center shadow-md">
				<p className="text-xl font-black pb-5">Доступно подключений:</p>
				<div className="w-32 h-32">
					<CircularProgressbar 
					value={percentage} 
					text={`${remainingConnections}/${maxConnections}`}
					styles={{
						path: {stroke: getColor(percentage),strokeLinecap: 'round'},
						trail: {stroke: '#F3F4F6'},
						text: {fontSize: '16px',fontWeight: 'bold',fill: getColorText()}
					}}
					/>
				</div>
			</div>
		</div>
	);
}