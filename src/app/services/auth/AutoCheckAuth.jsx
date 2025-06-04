import { Navigate } from "react-router-dom";
import API from '../API';

export const auth = async (token) => {
	if (!token) {
		localStorage.clear();
		Navigate('/auth');
		throw new Error('Token not found');
	};
	const response = await API.post('/login/auth', {},
		{headers: {
				'Token': `${token}`,
				'Access-Control-Allow-Origin':'*',
			},},);
		console.log("Ответ сервера:", response.data);		//DEBUG: ВРЕМЕННАЯ ДЛЯ ДЕБАГОВ
	return response;
};