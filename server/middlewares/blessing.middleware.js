import Joi from 'joi';

export const validateBlessing = (req, res, next) => {
    const nameRegex = /^[א-תa-zA-Z\s]+$/;
    const schema = Joi.object({
        name: Joi.string().pattern(nameRegex).required(),
        motherName: Joi.string().pattern(nameRegex).required(),
        blessingType: Joi.string().valid('רפואה שלמה', 'זיווג הגון', 'פרנסה טובה', 'ברכה והצלחה','חזרה בתשובה').required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return next({ 
            status: 400, 
            type: 'validation error', 
            error: { message: error.details[0].message } 
        });
    }
    next();
};