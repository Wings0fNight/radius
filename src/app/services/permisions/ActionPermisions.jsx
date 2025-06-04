import API from '../API';

const notToken = (token) => {
	if (!token) {
		throw new Error('Token not found');
	};
}

const importPermisions = async (token, {signal} = {}) => {
	notToken(token);
	const response = await API.post('/permissions/show', {},
		{headers: {
			'Token': `${token}`,
			'Access-Control-Allow-Origin':'*',
		},signal,},);
		console.log("Ответ сервера:", response.data);		//DEBUG: ВРЕМЕННАЯ ДЛЯ ДЕБАГОВ
	return response;
};

const updatePermisions = async (token, updateData ) => {
	notToken(token);
	const response = await API.post('/permissions/update', updateData,
		{headers: {
				'Token': `${token}`,
				'Access-Control-Allow-Origin':'*',
			},},);
	console.log("Ответ сервера:", response.data);					//DEBUG:ТЕСТОВАЯ ФУНКИЦЯ ПРОВЕРКИ ОТВЕТА СЕРВЕРА
	return response;
};

const delPermisions = async (token, delData ) => {
	notToken(token);
	const response = await API.post('/permissions/del', delData,
		{headers: {
				'Token': `${token}`,
				'Access-Control-Allow-Origin':'*',
			},},);
	console.log("Ответ сервера:", response.data);					//DEBUG:ТЕСТОВАЯ ФУНКИЦЯ ПРОВЕРКИ ОТВЕТА СЕРВЕРА
	return response;
};

const addPermisions = async (token, addData ) => {
	notToken(token);
	const response = await API.post('/permissions/add', addData,
		{headers: {
				'Token': `${token}`,
				'Access-Control-Allow-Origin':'*',
			},},);
	console.log("Ответ сервера:", response.data);					//DEBUG:ТЕСТОВАЯ ФУНКИЦЯ ПРОВЕРКИ ОТВЕТА СЕРВЕРА
	return response;
};
export { importPermisions, updatePermisions, delPermisions, addPermisions };
