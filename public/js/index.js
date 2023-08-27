import { login, register, logout } from './login';
import { updateSettings } from './updateSettings';

// Check if form exists on page
const loginForm = document.querySelector('.form--login');
const registerForm = document.querySelector('.form--register');
const logoutButton = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');

if (loginForm) {
	document.querySelector('.form').addEventListener('submit', (e) => {
		e.preventDefault();
		const email = document.getElementById('email').value;
		const password = document.getElementById('password').value;
		login(email, password);
	});
}

if (registerForm) {
	document.querySelector('.form').addEventListener('submit', (e) => {
		e.preventDefault();
		const username = document.getElementById('name').value;
		const email = document.getElementById('email').value;
		const password = document.getElementById('password').value;
		const confirmpassword = document.getElementById('passwordConfirm').value;
		register(username, email, password, confirmpassword);
	});
}

if (logoutButton) {
	logoutButton.addEventListener('click', logout);
}

if (userDataForm) {
	userDataForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const form = new FormData();
		form.append('name', document.getElementById('name').value);
		form.append('email', document.getElementById('email').value);
		form.append('photo', document.getElementById('photo').files[0]);
		updateSettings(form, 'data');
	});
}

if (userPasswordForm) {
	userPasswordForm.addEventListener('submit', async (e) => {
		e.preventDefault();
		document.querySelector('.btn--save-password').textContent = 'Updating...';

		const passwordCurrent = document.getElementById('password-current').value;
		const password = document.getElementById('password').value;
		const passwordConfirm = document.getElementById('password-confirm').value;
		await updateSettings({ passwordCurrent, password, passwordConfirm }, 'password');

		document.querySelector('.btn--save-password').textContent = 'Save password';
		document.getElementById('password-current').value = '';
		document.getElementById('password').value = '';
		document.getElementById('password-confirm').value = '';
	});
}

console.log('Hello from the bundle!');
