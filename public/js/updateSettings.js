import axios from 'axios';
import { showAlert } from './alert';

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
	try {
		const url = type === 'password' ? '/api/users/updateMyPassword' : '/api/users/updateMe';

		const res = await axios({
			method: 'PATCH',
			url,
			data
		});

		if (res.data.status === 'success') {
			showAlert('success', `Your ${type} was updated successfully!`);
			window.setTimeout(() => {
				location.assign('/me');
			}, 500);
		}
	} catch (err) {
		showAlert('error', err.response.data.message);
	}
};
