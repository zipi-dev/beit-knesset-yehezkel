import Joi from 'joi';

const nameRegex = /^[א-תa-zA-Z\s]+$/;

const nameField = Joi.string().trim().min(2).max(50).pattern(nameRegex).required()
    .messages({ '*': 'אנא מלאו שם ושם אם תקינים (אותיות בלבד)' });

export const blessingSchema = Joi.object({
    name: nameField,
    motherName: nameField,
    blessingType: Joi.string()
        .valid('רפואה שלמה', 'זיווג הגון', 'פרנסה טובה', 'ברכה והצלחה', 'חזרה בתשובה')
        .required()
        .messages({ '*': 'אנא בחרו סוג ברכה' })
});