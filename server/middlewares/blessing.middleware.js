import Joi from 'joi';

export const validateBlessing = (req, res, next) => {
    const nameRegex = /^[א-תa-zA-Z\s'׳\-]+$/;
    const schema = Joi.object({
        name: Joi.string().trim().max(60).pattern(nameRegex).required().messages({
            'string.empty': 'יש להזין שם',
            'string.pattern.base': 'השם יכול להכיל אותיות בלבד',
            'string.max': 'השם ארוך מדי',
            'any.required': 'שם הוא שדה חובה'
        }),
        motherName: Joi.string().trim().max(60).pattern(nameRegex).required().messages({
            'string.empty': 'יש להזין שם אם',
            'string.pattern.base': 'שם האם יכול להכיל אותיות בלבד',
            'string.max': 'השם ארוך מדי',
            'any.required': 'שם האם הוא שדה חובה'
        }),
        blessingType: Joi.string().valid('רפואה שלמה', 'זיווג הגון', 'פרנסה טובה', 'ברכה והצלחה', 'חזרה בתשובה').required()
    });
    const { error, value } = schema.validate(req.body);
    if (error) {
        return next({
            status: 400,
            type: 'validation error',
            error: { message: error.details[0].message }
        });
    }
    req.body = value; // הערכים אחרי trim, ובלי שדות מיותרים
    next();
};
