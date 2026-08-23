/**
 * מידלוואר שמקבל 4 פרמטרים
 * נועד לטיפול בשגיאות
 * @param {any} err נתוני השגיאה
 * @param {import("express").Request} req נתוני הבקשה
 * @param {import("express").Response} res נתוני התגובה
 * @param {import("express").NextFunction} next פונקציה למעבר למידלוואר הבא
 */
export const errorHandler = (err, req, res, next) => {
    // שליפת סטטוס וסוג השגיאה עם ברירות מחדל בטוחות
    const status = err.status || 500;
    const type = err.type || 'server error';

    // בדיקה האם השגיאה היא אובייקט עטוף או שגיאת JavaScript רגילה
    const errorObj = err.error || err;
    const message = errorObj.message || 'Internal Server Error';
    
    // הצגת ה-stack trace רק בסביבת פיתוח מטעמי אבטחה
    const stack = process.env.NODE_ENV === 'development' ? errorObj.stack : undefined;

    const error4Client = {
        type,
        message,
        ...(stack && { stack }), // יצרף את ה-stack רק אם הוא קיים (בפיתוח)
        fixEmail: 'help@gmail.com'
    };

    res.status(status).json({ error: error4Client });
};