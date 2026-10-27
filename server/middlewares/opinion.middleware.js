import Joi from 'joi';

export const validateOpinion = (req, res, next) => {
    // לקוח לא שולח likes - השרת מתחיל מ-0 לבד (אחרת אפשר לשלוח 99999 לייקים)
    const schema = Joi.object({
        userName: Joi.string().trim().max(100).required().messages({
            'string.empty': 'יש להזין שם',
            'string.max': 'השם לא יכול לעבור 100 תווים',
            'any.required': 'userName and comment are required fields'
        }),

        comment: Joi.string().trim().max(1000).required().messages({
            'string.empty': 'יש להזין תוכן לחוות הדעת',
            'string.max': 'חוות הדעת לא יכולה לעבור 1000 תווים',
            'any.required': 'userName and comment are required fields'
        })
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
        return next({
            status: 400,
            type: 'validation error',
            error: { message: error.details[0].message }
        });
    }

    // מעדכן את req.body עם הנתונים המנוקים (כולל Trim)
    req.body = value;

    next();
};

// מזהה המבקר מגיע בכותרת x-visitor-id. נדרש כדי לתת לייק.
export const requireVisitorId = (req, res, next) => {
    const visitorId = req.get('x-visitor-id');
 
    if (!visitorId || visitorId.length < 10 || visitorId.length > 100) {
        return next({
            status: 400,
            type: 'validation error',
            error: { message: 'Missing or invalid visitor id' }
        });
    }
 
    req.visitorId = visitorId;
    next();
};