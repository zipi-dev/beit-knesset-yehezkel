export const validateEvent = (req, res, next) => {
    // שלפנו גם את description מתוך ה-req.body
    const { id, name, eventDate, photographer, description } = req.body;

    // בודקים ID רק אם מדובר בבקשת PUT (עדכון). ב-POST (יצירה) אין עדיין ID במסד הנתונים
    if (req.method === 'PUT' && !id) {
        return next({
            status: 400,
            error: new Error('Event ID is required for update'),
            type: 'validation error'
        });
    }

    // בדיקת שדות חובה ליצירה/עדכון (ללא ID)
    if (!name || !eventDate) {
        return next({
            status: 400,
            error: new Error('Event name and event date are required fields'),
            type: 'validation error'
        });
    }

    if (typeof name !== 'string' || name.trim() === '') {
        return next({
            status: 400,
            error: new Error('Event name must be a non-empty string'),
            type: 'validation error'
        });
    }
    req.body.name = name.trim(); // Trim whitespace from the name

    const eventDateObj = new Date(eventDate);
    if (isNaN(eventDateObj.getTime())) {
        return next({
            status: 400,
            error: new Error('Event date must be a valid date'),
            type: 'validation error'
        });
    }
    req.body.eventDate = eventDateObj; // Convert to Date object

    if (photographer !== undefined && photographer !== null) {
        if (typeof photographer !== 'string' || photographer.trim() === '') {
            return next({
                status: 400,
                error: new Error('Photographer must be a non-empty string'),
                type: 'validation error'
            });
        }
        req.body.photographer = photographer.trim();
    } else {
        req.body.photographer = undefined;
    }

    // בדיקת תקינות ל-description (מוודאים שהוא אובייקט ולא מערך או טיפוס אחר)
    if (description !== undefined && description !== null) {
        if (typeof description !== 'object' || Array.isArray(description)) {
            return next({
                status: 422,
                error: new Error('Description must be an object'),
                type: 'validation error'
            });
        }
        
        // אם יש טקסט בתוך האובייקט, מנקים רווחים מיותרים
        if (description.text && typeof description.text === 'string') {
            description.text = description.text.trim();
        }
    }

    next(); // Proceed to the next middleware or route handler
};