// מזהה אנונימי קבוע לכל דפדפן. נשמר ב-localStorage ונשלח לשרת בכותרת x-visitor-id.
const KEY = 'beit-knesset-visitor-id';

const generateId = () => {
    if (globalThis.crypto?.randomUUID) return crypto.randomUUID();
    // גיבוי לדפדפנים ישנים / כתובות לא מאובטחות
    return `v-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
};

export const getVisitorId = () => {
    try {
        let id = localStorage.getItem(KEY);
        if (!id) {
            id = generateId();
            localStorage.setItem(KEY, id);
        }
        return id;
    } catch {
        // אם הדפדפן חוסם localStorage (למשל מצב פרטי) נשתמש במזהה זמני
        return generateId();
    }
};