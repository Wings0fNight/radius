import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { chPasswd } from "../services/auth/ChangePassAPI";

const ChangePassword = () => {
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [isLoading, setLoading] = useState(false);
	const navigate = useNavigate();
	const username = JSON.parse(localStorage.getItem("userData")).uname;

//FIXME: ПЕРЕДЕЛАТЬ ФУНКЦИЮ ОТПРАВКИ ПАРОЛЯ С ПРОВЕРКОЙ НА ПРАВИЛЬНОСТЬ ПАРОЛЯ (СТАРОГО + НОВЫЙ)
	const handleSubmit = async (e) => {
		console.log(oldPassword, newPassword, confirmPassword);
		e.preventDefault();
		setLoading(true);
		setError("");
		try {
			if (newPassword !== confirmPassword) {
				setError("Пароли не совпадают!");
				return;
			}
			if (oldPassword === newPassword) {
				setError("Пароли не должны совпадать!");
				return;
			}
			const response = await chPasswd(username, oldPassword, newPassword, confirmPassword);
			if (response.data.auth === true) {			//FIXME: После получения данных от бэка - обновить получаемые данные
				setSuccess("Пароль успешно изменен");
				navigate('/change-password');
			} else {
				setError("Пароль сменить не удалось");
			}
		} catch (error) {
			setError("Пароль сменить не удалось")
			console.error(error);
		} finally {
			setLoading(false);
		}
	};
	return (
		<div className="flex items-center justify-center h-screen p-10 bg-background">
			<div className="w-[40%] rounded-3xl bg-card border-2 border-border p-10 text-foreground shadow-2xl shadow-muted-foreground">
				<h1 className="text-5xl font-bold mb-10 text-center">Смена пароля</h1>
				<form onSubmit={handleSubmit} className="flex flex-col gap-5">
					<div className="relative z-0 w-full mb-3 group">
						<input 
							className="p-4 block py-2.5 px-0 w-full border-0 border-b-2 appearance-none text-foreground border-border focus:border-accent focus:outline-none focus:ring-0  peer"
							type="password"
							placeholder="old password"
							value={oldPassword}
							onChange={(e) => setOldPassword(e.target.value)}
							required
							disabled={isLoading}
						/>
					</div>
					<div className="relative z-0 w-full mb-3 group">
						<input
							className="p-4 block py-2.5 px-0 w-full border-0 border-b-2 appearance-none text-foreground border-border focus:border-accent focus:outline-none focus:ring-0  peer"
							type="password"
							placeholder="new password"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							required
							disabled={isLoading}
						/>
					</div>
					<div className="relative z-0 w-full mb-3 group">
						<input
							className="p-4 block py-2.5 px-0 w-full border-0 border-b-2 appearance-none text-foreground border-border focus:border-accent focus:outline-none focus:ring-0  peer"
							type="password"
							placeholder="confirm new password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
							disabled={isLoading}
						/>
					</div>
					{success && <p className="text-green-500 font-bold text-center">{success}</p>}
					{error && <p className="text-red-500 font-bold text-center">{error}</p>}
					<div className="flex justify-center mt-3">
						<button 
							type="submit" 
							disabled={isLoading}
							className="w-[50%] bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-xl">
							{isLoading ? "Проверка..." : "Сменить"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
export default ChangePassword