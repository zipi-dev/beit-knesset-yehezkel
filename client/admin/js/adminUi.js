import { logout } from '../../services/authService.js';

// יוצר אלמנט עם טקסט ו-class (בלי innerHTML)
export const h = (tag, text = '', cls = '') => {
    const el = document.createElement(tag);
    if (text) el.textContent = text;
    if (cls) el.className = cls;
    return el;
};

// טיפול אחיד בשגיאות: אם ההתחברות פגה או אין הרשאה - חזרה להתחברות
export const showError = (error) => {
    if (error.status === 401 || error.status === 403) {
        logout();
        window.location.href = './login.html';
        return;
    }
    alert(error.message || 'אירעה שגיאה, אנא נסי שוב');
};
