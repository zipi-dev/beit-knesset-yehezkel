import { getCurrentUser, logout } from '../../services/authService.js';
import { getAllRabbis } from '../../services/rabbiService.js';

const user = getCurrentUser();

// The greeting: the rabbi's name for a rabbi or the manager, and "גבאי" for a gabbai
const buildGreeting = async (user) => {
    if (user.role === 'gabbai') return 'שלום גבאי';

    if (user.rabbiProfile) {
        try {
            const rabbis = await getAllRabbis();
            const rabbi = rabbis.find(r => r._id === user.rabbiProfile);
            if (rabbi) return `שלום ${rabbi.name}`;
        } catch {
            // if the rabbis could not be loaded, the general greeting below is used
        }
    }
    return user.role === 'admin' ? 'שלום מנהל' : 'שלום';
};

// התפקידים שמורשים לראות את הדף נקבעים ב-<body data-roles="admin,gabbai">
const allowedRoles = (document.body.dataset.roles || '').split(',').map(r => r.trim()).filter(Boolean);

if (!user || !localStorage.getItem('token')) {
    // Not logged in - back to the login page
    window.location.href = './login.html';
} else if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    // Logged in but without permission for this page
    window.location.href = './dashboard.html';
} else {
    buildGreeting(user).then(text => {
        document.getElementById('admin-greeting').textContent = text;
    });

    // בלוח הניהול: מסתירים קישורים שהתפקיד הזה לא מורשה להשתמש בהם (<li data-for-roles="admin,rabbi">)
    document.querySelectorAll('[data-for-roles]').forEach(el => {
        const roles = el.dataset.forRoles.split(',').map(r => r.trim());
        if (!roles.includes(user.role)) el.classList.add('hidden');
    });
    const emptyNote = document.getElementById('dash-empty');
    if (emptyNote && !document.querySelector('[data-for-roles]:not(.hidden)')) emptyNote.classList.remove('hidden');

    document.getElementById('logout-btn').addEventListener('click', () => {
        logout();
        window.location.href = './login.html';
    });
}