import { login } from '../../services/authService.js';
const form = document.getElementById('login-form');
const errorBox = document.getElementById('login-error');

const showError = (message) => {
    errorBox.textContent = message;
    errorBox.classList.remove('hidden');
};

form.addEventListener('submit', async (e) => {
    e.preventDefault(); // stops the page from reloading
    errorBox.classList.add('hidden');

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    try {
        await login(username, password);
        window.location.href = './shiurimAdmin.html'; // the admin page, built in the next steps
    } catch (error) {
        showError(error.message);
    }
});