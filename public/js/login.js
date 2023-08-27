import axios from 'axios';
import { showAlert } from './alert.js';

export const login = async (email, password) => {
	try {
		const res = await axios({
			method: 'POST',
			url: '/api/v1/users/login',
			data: {
				email: email,
				password: password
			}
		});

		if (res.data.status === 'success') {
			showAlert('success', 'Logged in successfully!');
			window.setTimeout(() => {
				location.assign('/');
			}, 500);
		}
	} catch (err) {
		showAlert('error', err.response.data.message);
	}
};

export const register = async (name, email, password, passwordConfirm) => {
	try {
		const res = await axios({
			method: 'POST',
			url: '/api/v1/users/signup',
			data: {
				name,
				email,
				password, 
				passwordConfirm
			}
		});

		if (res.data.status === 'success') {
			showAlert('success', 'Registered successfully!');
			window.setTimeout(() => {
				location.assign('/');
			}, 500);
		}
	} catch (err) {
		showAlert('error', err.response.data.message);
	}
};

export const logout = async () => {
	try {
		const res = await axios({
			method: 'GET',
			url: '/api/v1/users/logout'
		});
		if ((res.data.status = 'success')) location.assign('/');
	} catch (err) {
		showAlert('error', 'Error logging out! Try again.');
	}
};
