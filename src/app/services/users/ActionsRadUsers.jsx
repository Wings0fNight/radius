import API from '../API';

const notToken = (token) => {
	if (!token) {
		throw new Error('Token not found');
	};
}

const importUsers = async (token, {signal} = {}) => {
	notToken(token);
	const response = await API.post('/users/show', {},
		{headers: {
				'Token': `${token}`,
				'Access-Control-Allow-Origin':'*',
			},signal,});
		console.log("Ответ сервера:", response.data);		//DEBUG: ВРЕМЕННАЯ ДЛЯ ДЕБАГОВ
	return response;
};

const addUser = async (token, updateData ) => {
	notToken(token);
	const response = await API.post('/users/add', updateData,
		{headers: {
				'Token': `${token}`,
				'Access-Control-Allow-Origin':'*',
			},},);
	console.log("Ответ сервера:", response.data);					//DEBUG:ТЕСТОВАЯ ФУНКИЦЯ ПРОВЕРКИ ОТВЕТА СЕРВЕРА
	return response;
};

const updateStatusUser = async (token, updateData ) => {
	notToken(token);
	const response = await API.post('/users/update', updateData,
		{headers: {
				'Token': `${token}`,
				'Access-Control-Allow-Origin':'*',
			},},);
	console.log("Ответ сервера:", response.data);					//DEBUG:ТЕСТОВАЯ ФУНКИЦЯ ПРОВЕРКИ ОТВЕТА СЕРВЕРА
	return response;
};

const changePasswordUser = async (token, updateData ) => {
	notToken(token);
	const response = await API.post('/users/password', updateData,
		{headers: {
				'Token': `${token}`,
				'Access-Control-Allow-Origin':'*',
			},},);
	console.log("Ответ сервера:", response.data);					//DEBUG:ТЕСТОВАЯ ФУНКИЦЯ ПРОВЕРКИ ОТВЕТА СЕРВЕРА
	return response;
};

const deleteUser = async (token, updateData ) => {
	console.log('Delete user:', updateData);
	notToken(token);
	const response = await API.post('/users/del', updateData,
		{headers: {
				'Token': `${token}`,
				'Access-Control-Allow-Origin':'*',
			},},);
	console.log("Ответ сервера:", response.data);					//DEBUG:ТЕСТОВАЯ ФУНКИЦЯ ПРОВЕРКИ ОТВЕТА СЕРВЕРА
	return response;
};

const importRobots = async (token, {signal} = {}) => {
	notToken(token);
	const response = await API.post('/robots/show', {},
		{headers: {
				'Token': `${token}`,
				'Access-Control-Allow-Origin':'*',
			},signal,});
		console.log("Ответ сервера:", response.data);		//DEBUG: ВРЕМЕННАЯ ДЛЯ ДЕБАГОВ
	return response;
};

const addRobots = async (token, updateData ) => {
	notToken(token);
	const response = await API.post('/robots/add', updateData,
		{headers: {
				'Token': `${token}`,
				'Access-Control-Allow-Origin':'*',
			},},);
	console.log("Ответ сервера:", response.data);					//DEBUG:ТЕСТОВАЯ ФУНКИЦЯ ПРОВЕРКИ ОТВЕТА СЕРВЕРА
	return response;
};

const updateStatusRobots = async (token, updateData ) => {
	notToken(token);
	const response = await API.post('/robots/update', updateData,
		{headers: {
				'Token': `${token}`,
				'Access-Control-Allow-Origin':'*',
			},},);
	console.log("Ответ сервера:", response.data);					//DEBUG:ТЕСТОВАЯ ФУНКИЦЯ ПРОВЕРКИ ОТВЕТА СЕРВЕРА
	return response;
};

const changePasswordRobots = async (token, updateData ) => {
	notToken(token);
	const response = await API.post('/robots/password', updateData,
		{headers: {
				'Token': `${token}`,
				'Access-Control-Allow-Origin':'*',
			},},);
	console.log("Ответ сервера:", response.data);					//DEBUG:ТЕСТОВАЯ ФУНКИЦЯ ПРОВЕРКИ ОТВЕТА СЕРВЕРА
	return response;
};

const deleteRobots = async (token, updateData ) => {
	console.log('Delete Robots:', updateData);
	notToken(token);
	const response = await API.post('/robots/del', updateData,
		{headers: {
				'Token': `${token}`,
				'Access-Control-Allow-Origin':'*',
			},},);
	console.log("Ответ сервера:", response.data);					//DEBUG:ТЕСТОВАЯ ФУНКИЦЯ ПРОВЕРКИ ОТВЕТА СЕРВЕРА
	return response;
};

const importGroups = async (token, {signal} = {}) => {
	notToken(token);
	const response = await API.post('/groups/show', {},
		{headers: {
				'Token': `${token}`,
				'Access-Control-Allow-Origin':'*',
			},signal,});
		console.log("Ответ сервера:", response.data);		//DEBUG: ВРЕМЕННАЯ ДЛЯ ДЕБАГОВ
	return response;
};

const addGroups = async (token, updateData ) => {
	notToken(token);
	const response = await API.post('/groups/add', updateData,
		{headers: {
				'Token': `${token}`,
				'Access-Control-Allow-Origin':'*',
			},},);
	console.log("Ответ сервера:", response.data);					//DEBUG:ТЕСТОВАЯ ФУНКИЦЯ ПРОВЕРКИ ОТВЕТА СЕРВЕРА
	return response;
};

const updateGroups = async (token, updateData ) => {
	notToken(token);
	const response = await API.post('/groups/update', updateData,
		{headers: {
				'Token': `${token}`,
				'Access-Control-Allow-Origin':'*',
			},},);
	console.log("Ответ сервера:", response.data);					//DEBUG:ТЕСТОВАЯ ФУНКИЦЯ ПРОВЕРКИ ОТВЕТА СЕРВЕРА
	return response;
};

const deleteGroups = async (token, updateData ) => {
	console.log('Delete Robots:', updateData);
	notToken(token);
	const response = await API.post('/groups/del', updateData,
		{headers: {
				'Token': `${token}`,
				'Access-Control-Allow-Origin':'*',
			},},);
	console.log("Ответ сервера:", response.data);					//DEBUG:ТЕСТОВАЯ ФУНКИЦЯ ПРОВЕРКИ ОТВЕТА СЕРВЕРА
	return response;
};

export { importUsers, addUser, updateStatusUser, changePasswordUser, deleteUser, importRobots, addRobots, updateStatusRobots, changePasswordRobots, deleteRobots, importGroups, addGroups, updateGroups, deleteGroups };