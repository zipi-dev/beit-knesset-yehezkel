import { registerUser } from '../../services/userService.js';
import { openUserDialog } from './userDialog.js';

document.getElementById('add-user-btn')?.addEventListener('click', (event) => {
    event.preventDefault();
    openUserDialog({
        onSave: async (data) => {
            await registerUser(data);
            alert('המשתמש נוסף בהצלחה');
        }
    });
});