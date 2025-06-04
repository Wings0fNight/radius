import axios from "axios";

const API = axios.create({
	baseURL: "http://10.101.28.50:7881",
});

export default API;