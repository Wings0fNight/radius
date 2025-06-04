import API from '../API';

const notToken = (token) => {
	if (!token) {
		throw new Error('Token not found');
	};
}

const importTacacsGroups = async (token, {signal} = {}) => {
	notToken(token);
	const response = await API.post('/tacacsgroups/show', {},
		{headers: {
			'Token': `${token}`,
			'Access-Control-Allow-Origin':'*',
		},signal,},);
		console.log("Ответ сервера:", response.data);		//DEBUG: ВРЕМЕННАЯ ДЛЯ ДЕБАГОВ
	return response;
};

const updateTacacsGroups = async (token, updateData ) => {
	notToken(token);
	const response = await API.post('/tacacsgroups/update', updateData,
		{headers: {
				'Token': `${token}`,
				'Access-Control-Allow-Origin':'*',
			},},);
	console.log("Ответ сервера:", response.data);					//DEBUG:ТЕСТОВАЯ ФУНКИЦЯ ПРОВЕРКИ ОТВЕТА СЕРВЕРА
	return response;
};

const delTacacsGroups = async (token, delData ) => {
	notToken(token);
	const response = await API.post('/tacacsgroups/del', delData,
		{headers: {
				'Token': `${token}`,
				'Access-Control-Allow-Origin':'*',
			},},);
	console.log("Ответ сервера:", response.data);					//DEBUG:ТЕСТОВАЯ ФУНКИЦЯ ПРОВЕРКИ ОТВЕТА СЕРВЕРА
	return response;
};

const addTacacsGroups = async (token, addData ) => {
	notToken(token);
	const response = await API.post('/tacacsgroups/add', addData,
		{headers: {
				'Token': `${token}`,
				'Access-Control-Allow-Origin':'*',
			},},);
	console.log("Ответ сервера:", response.data);					//DEBUG:ТЕСТОВАЯ ФУНКИЦЯ ПРОВЕРКИ ОТВЕТА СЕРВЕРА
	return response;
};
export { importTacacsGroups, updateTacacsGroups, delTacacsGroups, addTacacsGroups };
