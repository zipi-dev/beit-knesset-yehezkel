import Joi from 'joi';

export const validateEvent = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().trim().max(200).required().messages({
            'string.empty': 'יש להזין שם לאירוע',
            'any.required': 'שם האירוע הוא שדה חובה'
        }),
        eventDate: Joi.date().required().messages({
            'date.base': 'תאריך האירוע אינו תקין',
            'any.required': 'תאריך האירוע הוא שדה חובה'
        }),
        description: Joi.object({
            text: Joi.string().trim().max(2000).allow('').optional()
        }).optional(),
        photographer: Joi.string().trim().max(100).allow('').optional(),
        // רק http/https - חוסם כתובות מסוכנות כמו javascript:
        mediaUrl: Joi.string().trim().uri({ scheme: ['http', 'https'] }).allow('').optional().messages({
            'string.uri': 'קישור המדיה אינו תקין'
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

    req.body = value; // הנתונים המנוקים (trim והמרת תאריך)
    next();
};