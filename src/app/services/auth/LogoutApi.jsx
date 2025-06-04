import API from '../API';
export const logout = async (token) => {
	const response = await API.post('/login/logout', {},
	 {
		headers: {
			'Token': `${token}`,
			'Access-Control-Allow-Origin':'*',
		},
	},);
	return response;
};