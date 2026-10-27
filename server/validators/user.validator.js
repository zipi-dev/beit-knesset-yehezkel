import Joi from 'joi';

//Validation schema for user registration
export const registerSchema = Joi.object({
    username: Joi.string().required().trim(),
    password: Joi.string()
        .required()
        .min(7)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{7,}$/)
        .messages({
            'string.min': 'הסיסמה חייבת להכיל לפחות 7 תווים',
            'string.pattern.base': 'הסיסמה חייבת להכיל לפחות אות קטנה אחת, אות גדולה אחת באנגלית, מספר אחד ותו מיוחד אחד לפחות',
            'any.required': 'שדה סיסמה הוא חובה'
        }),
        role: Joi.string().valid('rabbi', 'gabbai').required(),
        rabbi: Joi.when('role', {
        is: 'rabbi',
        then: Joi.object({
            name: Joi.string().trim().min(2).required(),
            imageUrl: Joi.string().trim().required(),
            bio: Joi.string().trim().required()
        }).required(),
        otherwise: Joi.forbidden()
    })
});

//It is schema for login
export const loginSchema = Joi.object({
    username: Joi.string().required().trim(),
    password: Joi.string().required()
});

export const updateUserSchema = Joi.object({
    username: Joi.string().trim(),
    password: Joi.string()
        .min(7)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{7,}$/)
        .messages({
            'string.min': 'הסיסמה חייבת להכיל לפחות 7 תווים',
            'string.pattern.base': 'הסיסמה חייבת להכיל לפחות אות קטנה אחת, אות גדולה אחת באנגלית, מספר אחד ותו מיוחד אחד לפחות'
        })
}).min(1);