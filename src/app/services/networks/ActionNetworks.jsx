import API from '../API';

const notToken = (token) => {
	if (!token) {
		throw new Error('Token not found');
	};
}

const importNetworks = async (token, {signal} = {}) => {
	notToken(token);
	const response = await API.post('/networks/show', {},
		{headers: {
			'Token': `${token}`,
			'Access-Control-Allow-Origin':'*',
		},signal,},);
		console.log("Ответ сервера NETWORKS:", response.data);		//DEBUG: ВРЕМЕННАЯ ДЛЯ ДЕБАГОВ
	return response;
};

const getNetwork = async (token, getData ) => {
	notToken(token);
	const response = await API.post('/networks/get', getData,
		{headers: {
				'Token': `${token}`,
				'Access-Control-Allow-Origin':'*',
			},},);
	console.log("Ответ сервера:", response.data);					//DEBUG:ТЕСТОВАЯ ФУНКИЦЯ ПРОВЕРКИ ОТВЕТА СЕРВЕРА
	return response;
};

const updateNetworks = async (token, updateData ) => {
	notToken(token);
	const response = await API.post('/networks/update', updateData,
		{headers: {
				'Token': `${token}`,
				'Access-Control-Allow-Origin':'*',
			},},);
	console.log("Ответ сервера:", response.data);					//DEBUG:ТЕСТОВАЯ ФУНКИЦЯ ПРОВЕРКИ ОТВЕТА СЕРВЕРА
	return response;
};

const delNetworks = async (token, delData ) => {
	notToken(token);
	const response = await API.post('/networks/del', delData,
		{headers: {
				'Token': `${token}`,
				'Access-Control-Allow-Origin':'*',
			},},);
	console.log("Ответ сервера:", response.data);					//DEBUG:ТЕСТОВАЯ ФУНКИЦЯ ПРОВЕРКИ ОТВЕТА СЕРВЕРА
	return response;
};

const addNetworks = async (token, addData ) => {
	notToken(token);
	const response = await API.post('/networks/add', addData,
		{headers: {
				'Token': `${token}`,
				'Access-Control-Allow-Origin':'*',
			},},);
	console.log("Ответ сервера:", response.data);					//DEBUG:ТЕСТОВАЯ ФУНКИЦЯ ПРОВЕРКИ ОТВЕТА СЕРВЕРА
	return response;
};

const importResponsibilities = async (token, {signal} = {}) => {
	notToken(token);
	const response = await API.post('/responsibilities/show', {},
		{headers: {
			'Token': `${token}`,
			'Access-Control-Allow-Origin':'*',
		},signal,},);
		console.log("Ответ сервера RESPONSIBILITIES:", response.data);		//DEBUG: ВРЕМЕННАЯ ДЛЯ ДЕБАГОВ
	return response;
};

const addResponsibilities = async (token, addData ) => {
	notToken(token);
	const response = await API.post('/responsibilities/add', addData,
		{headers: {
				'Token': `${token}`,
				'Access-Control-Allow-Origin':'*',
			},},);
	console.log("Ответ сервера RESPONSIBILITIES:", response.data);					//DEBUG:ТЕСТОВАЯ ФУНКИЦЯ ПРОВЕРКИ ОТВЕТА СЕРВЕРА
	return response;
};

const delResponsibilities = async (token, delData ) => {
	notToken(token);
	const response = await API.post('/responsibilities/del', delData,
		{headers: {
				'Token': `${token}`,
				'Access-Control-Allow-Origin':'*',
			},},);
	console.log("Ответ сервера RESPONSIBILITIES:", response.data);					//DEBUG:ТЕСТОВАЯ ФУНКИЦЯ ПРОВЕРКИ ОТВЕТА СЕРВЕРА
	return response;
};

const updateResponsibilities = async (token, updateData ) => {
	notToken(token);
	const response = await API.post('/responsibilities/update', updateData,
		{headers: {
				'Token': `${token}`,
				'Access-Control-Allow-Origin':'*',
			},},);
	console.log("Ответ сервера RESPONSIBILITIES:", response.data);					//DEBUG:ТЕСТОВАЯ ФУНКИЦЯ ПРОВЕРКИ ОТВЕТА СЕРВЕРА
	return response;
};

const importTrustedIps = async (token, {signal} = {}) => {
	notToken(token);
	const response = await API.post('/trustedips/show', {},
		{headers: {
			'Token': `${token}`,
			'Access-Control-Allow-Origin':'*',
		},signal,},);
		console.log("Ответ сервера TRUSTED IP:", response.data);		//DEBUG: ВРЕМЕННАЯ ДЛЯ ДЕБАГОВ
	return response;
};


const addTrustedIps = async (token, addData ) => {
	notToken(token);
	const response = await API.post('/trustedips/add', addData,
		{headers: {
				'Token': `${token}`,
				'Access-Control-Allow-Origin':'*',
			},},);
	console.log("Ответ сервера TRUSTED IP:", response.data);					//DEBUG:ТЕСТОВАЯ ФУНКИЦЯ ПРОВЕРКИ ОТВЕТА СЕРВЕРА
	return response;
};

const delTrustedIps = async (token, delData ) => {
	notToken(token);
	const response = await API.post('/trustedips/del', delData,
		{headers: {
				'Token': `${token}`,
				'Access-Control-Allow-Origin':'*',
			},},);
	console.log("Ответ сервера TRUSTED IP:", response.data);					//DEBUG:ТЕСТОВАЯ ФУНКИЦЯ ПРОВЕРКИ ОТВЕТА СЕРВЕРА
	return response;
};

const updateTrustedIps = async (token, updateData ) => {
	notToken(token);
	const response = await API.post('/trustedips/update', updateData,
		{headers: {
				'Token': `${token}`,
				'Access-Control-Allow-Origin':'*',
			},},);
	console.log("Ответ сервера TRUSTED IP:", response.data);					//DEBUG:ТЕСТОВАЯ ФУНКИЦЯ ПРОВЕРКИ ОТВЕТА СЕРВЕРА
	return response;
};

const importSites = async (token, {signal} = {}) => {
	notToken(token);
	const response = await API.post('/sites/show', {},
		{headers: {
			'Token': `${token}`,
			'Access-Control-Allow-Origin':'*',
		},signal,},);
		console.log("Ответ сервера SITES:", response.data);		//DEBUG: ВРЕМЕННАЯ ДЛЯ ДЕБАГОВ
	return response;
};

const addSites = async (token, addData ) => {
	notToken(token);
	const response = await API.post('/sites/add', addData,
		{headers: {
				'Token': `${token}`,
				'Access-Control-Allow-Origin':'*',
			},},);
	console.log("Ответ сервера SITES:", response.data);					//DEBUG:ТЕСТОВАЯ ФУНКИЦЯ ПРОВЕРКИ ОТВЕТА СЕРВЕРА
	return response;
};

const delSites = async (token, delData ) => {
	notToken(token);
	const response = await API.post('/sites/del', delData,
		{headers: {
				'Token': `${token}`,
				'Access-Control-Allow-Origin':'*',
			},},);
	console.log("Ответ сервера SITES:", response.data);					//DEBUG:ТЕСТОВАЯ ФУНКИЦЯ ПРОВЕРКИ ОТВЕТА СЕРВЕРА
	return response;
};

const updateSites = async (token, updateData ) => {
	notToken(token);
	const response = await API.post('/sites/update', updateData,
		{headers: {
				'Token': `${token}`,
				'Access-Control-Allow-Origin':'*',
			},},);
	console.log("Ответ сервера SITES:", response.data);					//DEBUG:ТЕСТОВАЯ ФУНКИЦЯ ПРОВЕРКИ ОТВЕТА СЕРВЕРА
	return response;
};
export { 
	importNetworks, 
	getNetwork,
	updateNetworks,
	delNetworks,
	addNetworks, 
	importResponsibilities, 
	addResponsibilities, 
	delResponsibilities,
	updateResponsibilities,
	importTrustedIps,
	addTrustedIps,
	delTrustedIps,
	updateTrustedIps,
	importSites,
	addSites,
	delSites,
	updateSites,
};
