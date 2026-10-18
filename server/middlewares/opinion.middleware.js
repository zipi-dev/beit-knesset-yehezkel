export const validateOpinion = (req, res, next) => {
    let { userId, eventId, rating, comment, title, isApproved } = req.body;

    // 1. ניקוי רווחים ראשוני (Trim)
    if (title && typeof title === 'string') req.body.title = title.trim();
    if (comment && typeof comment === 'string') req.body.comment = comment.trim();
    if (userId && typeof userId === 'string') req.body.userId = userId.trim();
    if (eventId && typeof eventId === 'string') req.body.eventId = eventId.trim();

    // 2. טיפול בשדות אופציונליים ריקים (כמו חוות דעת כללית בלי eventId)
    if (req.body.eventId === '') {
        req.body.eventId = null; 
    }
    if (req.body.userId === '') {
        req.body.userId = null; 
    }

    // 3. בדיקת שדות חובה בסיסיים (שימי לב ש-eventId אינו חובה כאן)
    if (!req.body.userId || req.body.rating === undefined || !req.body.comment) {
        return next({
            status: 400,
            error: new Error('userId, rating, and comment are required fields'),
            type: 'validation error'
        });
    }

    // 4. בדיקת תקינות לדירוג (Rating בין 1 ל-5)
    const parsedRating = Number(req.body.rating);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
        return next({
            status: 400,
            error: new Error('Rating must be a number between 1 and 5'),
            type: 'validation error'
        });
    }
    req.body.rating = parsedRating; // שמירת המספר המומר

    // 5. בדיקת תוכן חוות הדעת (Comment) ואורך מקסימלי (עד 1000 תווים)
    if (typeof req.body.comment !== 'string' || req.body.comment === '') {
        return next({
            status: 400,
            error: new Error('Comment must be a non-empty string'),
            type: 'validation error'
        });
    }
    if (req.body.comment.length > 1000) {
        return next({
            status: 400,
            error: new Error('Comment must not exceed 1000 characters'),
            type: 'validation error'
        });
    }

    // 6. בדיקת כותרת (Title - אופציונלי, אבל אם קיימת אסור שתעבור 100 תווים)
    if (req.body.title !== undefined && req.body.title !== null && req.body.title !== '') {
        if (typeof req.body.title !== 'string') {
            return next({
                status: 400,
                error: new Error('Title must be a string'),
                type: 'validation error'
            });
        }
        if (req.body.title.length > 100) {
            return next({
                status: 400,
                error: new Error('Title must not exceed 100 characters'),
                type: 'validation error'
            });
        }
    }

    // 7. בדיקת אישור מנהל (isApproved - אופציונלי, חייב להיות בוליאני)
    if (req.body.isApproved !== undefined) {
        if (typeof req.body.isApproved !== 'boolean') {
            return next({
                status: 400,
                error: new Error('isApproved must be a boolean'),
                type: 'validation error'
            });
        }
    }

    // הכל עבר בהצלחה! ממשיכים לקונטרולר
    next();
};