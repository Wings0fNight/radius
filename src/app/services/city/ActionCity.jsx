import API from '../API';

const notToken = (token) => {
	if (!token) {
		throw new Error('Token not found');
	};
}

const importCity = async (token, {signal} = {}) => {
	notToken(token);
	const response = await API.post('/cities/show', {},
		{headers: {
			'Token': `${token}`,
			'Access-Control-Allow-Origin':'*',
		},signal,},);
		console.log("Ответ сервера:", response.data);		//DEBUG: ВРЕМЕННАЯ ДЛЯ ДЕБАГОВ
	return response;
};

const updateCity = async (token, updateData ) => {
	notToken(token);
	const response = await API.post('/cities/update', updateData,
		{headers: {
				'Token': `${token}`,
				'Access-Control-Allow-Origin':'*',
			},},);
	console.log("Ответ сервера:", response.data);					//DEBUG:ТЕСТОВАЯ ФУНКИЦЯ ПРОВЕРКИ ОТВЕТА СЕРВЕРА
	return response;
};

const delCity = async (token, delData ) => {
	notToken(token);
	const response = await API.post('/cities/del', delData,
		{headers: {
				'Token': `${token}`,
				'Access-Control-Allow-Origin':'*',
			},},);
	console.log("Ответ сервера:", response.data);					//DEBUG:ТЕСТОВАЯ ФУНКИЦЯ ПРОВЕРКИ ОТВЕТА СЕРВЕРА
	return response;
};

const addCity = async (token, addData ) => {
	notToken(token);
	const response = await API.post('/cities/add', addData,
		{headers: {
				'Token': `${token}`,
				'Access-Control-Allow-Origin':'*',
			},},);
	console.log("Ответ сервера:", response.data);					//DEBUG:ТЕСТОВАЯ ФУНКИЦЯ ПРОВЕРКИ ОТВЕТА СЕРВЕРА
	return response;
};
export { importCity, updateCity, delCity, addCity };
