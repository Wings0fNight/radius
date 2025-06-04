import API from '../API';

export const auth = async (username, password) => {
	const credentials = btoa(`${username}:${password}`);
	const response = await API.post('/login/auth', {},
	 {headers: {
			'Authorization': `${credentials}`,
			'Access-Control-Allow-Origin':'*',
		},},);
	console.log("Ответ сервера:", response.data);					//DEBUG:ТЕСТОВАЯ ФУНКИЦЯ ПРОВЕРКИ ОТВЕТА СЕРВЕРА
	return response;
};