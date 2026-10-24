import Joi from 'joi';

//Validation schema for user registration
export const registerSchema = Joi.object({
    name: Joi.string().required().trim().min(2),
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
    role: Joi.string().valid( 'rabbi', 'gabbai').default('rabbi')
});

//It is schema for login
export const loginSchema = Joi.object({
    username: Joi.string().required().trim(),
    password: Joi.string().required()
});

export const updateUserSchema = Joi.object({
    name: Joi.string().trim().min(2),
    username: Joi.string().trim(),
    password: Joi.string()
        .min(7)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{7,}$/)
        .messages({
            'string.min': 'הסיסמה חייבת להכיל לפחות 7 תווים',
            'string.pattern.base': 'הסיסמה חייבת להכיל לפחות אות קטנה אחת, אות גדולה אחת באנגלית, מספר אחד ותו מיוחד אחד לפחות'
        })
}).min(1);