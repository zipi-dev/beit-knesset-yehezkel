import Joi from 'joi';

const prayerSchema = Joi.object({
    // _id מותר: כשהמנהל שולח בחזרה לוח שהגיע מהשרת, התפילות כבר מכילות מזהה
    _id: Joi.string().hex().length(24).optional(),
    name: Joi.string().trim().max(100).required().messages({
        'string.empty': 'יש להזין שם תפילה',
        'any.required': 'שם התפילה הוא שדה חובה'
    }),
    // שעה חופשית (למשל "07:30" או "18 דקות לפני השקיעה")
    time: Joi.string().trim().max(50).required().messages({
        'string.empty': 'יש להזין שעת תפילה',
        'any.required': 'שעת התפילה היא שדה חובה'
    }),
    notes: Joi.string().trim().max(200).optional().allow(null, '')
});

const scheduleSchema = Joi.object({
    title: Joi.string().trim().max(150).required().messages({
        'string.empty': 'יש להזין כותרת ללוח',
        'any.required': 'כותרת הלוח היא שדה חובה'
    }),
    date: Joi.date().optional().allow(null).messages({
        'date.base': 'תאריך הלוח אינו תקין'
    }),
    isActive: Joi.boolean().optional().messages({
        'boolean.base': 'isActive חייב להיות true או false'
    }),
    prayers: Joi.array().items(prayerSchema).optional()
});

const run = (schema) => (req, res, next) => {
    // stripUnknown: מסיר שדות שלא הוגדרו (כמו _id, createdAt, __v שחוזרים מהשרת)
    const { error, value } = schema.validate(req.body, { stripUnknown: true });

    if (error) {
        return next({
            status: 400,
            type: 'validation error',
            error: { message: error.details[0].message }
        });
    }

    req.body = value;
    next();
};

// יצירה: כותרת חובה
export const validateSchedule = run(scheduleSchema);

// עדכון: כל שדה אופציונלי (כדי שאפשר לשלוח רק { isActive: true }), אבל חייב לפחות שדה אחד
export const validateScheduleUpdate = run(
    scheduleSchema.fork(['title'], (field) => field.optional()).min(1)
);

// הוספת תפילה בודדת ללוח: אותם כללים כמו תפילה בתוך לוח, אבל _id לא מתקבל מהלקוח (מונגו יוצר אותו)
export const validatePrayer = run(
    prayerSchema.fork(['_id'], (field) => field.strip())
);