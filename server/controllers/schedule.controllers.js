//fanction need
// יצירת לוח זמנים (createSchedule): 
// פונקציה (POST) המקבלת את כותרת הלוח ומערך מלא של התפילות שהגבאי הזין,
//  ושומרת אותם במסמך אחד ב-MongoDB.

// שליפת הלוח הפעיל (getActiveSchedule):
//  פונקציה (GET) המיועדת לתצוגה באתר עבור קהל המתפללים. 
// היא תחפש ותחזיר רק את לוח הזמנים שהגבאי סימן בו isActive: true.

// שליפת כל הלוחות (getAllSchedules): 
// פונקציה (GET) עבור פאנל הניהול של הגבאי, 
// כדי שיוכל לראות את כל לוחות הזמנים שיצר אי פעם (חול, שבת, חגים).

// עדכון לוח קיים (updateSchedule):
//  פונקציה (PUT) המאפשרת לגבאי לערוך שעות של תפילה מסוימת, להוסיף פתאום "מוסף" או "מנחה גדולה"
// , או להחליף איזה לוח פעיל כרגע באתר.

// מחיקת לוח (deleteSchedule):
//  פונקציה (DELETE) להסרת לוחות זמנים ישנים שכבר אינם בשימוש.

// מחיקת תפילה מתוך מערך התפילות (removePrayerFromSchedule):
// פונקציה (DELETE) שמקבלת מזהה של לוח ומזהה של תפילה ספציפית, 
// ומסירה את התפילה מהמערך של הלוח הזה בלבד, מבלי למחוק את כל הלוח עצמו.

export const createSchedule = async (req, res, next) => {
    try {
        const newSchedule = new Schedule(req.body);
        const savedSchedule = await newSchedule.save();
        res.status(201).json(savedSchedule);
        
    } catch (error) {
        next({
            status: 500,
            type: 'database error',
             error: error
        });           
    }
};
export const getActiveSchedule = async (req, res, next) => {
    try {
        const activeSchedule = await Schedule.findOne({ isActive: true });
        if (!activeSchedule) {
            return next({
                status: 404,
                type: 'not found',
                error: new Error('No active schedule found')
            });
        }
        res.json(activeSchedule);
    } catch (error) {
        next({
            status: 500,
            type: 'database error',
            error: error
        });
    }
};
export const getAllSchedules = async (req, res, next) => {
    try {
        const schedules = await Schedule.find();
        res.json(schedules);
    } catch (error) {
        next({
            status: 500,
            type: 'database error',
            error: error
        });
    }
};
export const updateSchedule = async (req, res, next) => {
    try {
        const updatedSchedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedSchedule) {
            return next({   
                status: 404,
                type: 'not found',
                error: new Error('Schedule not found')
            });
        }
        res.json(updatedSchedule);
    } catch (error) {
        next({
            status: 500,
            type: 'database error',
            error: error
        });
    }   
};
export const deleteSchedule = async (req, res, next) => {
    try {
        const deletedSchedule = await Schedule.findByIdAndDelete(req.params.id);
        if (!deletedSchedule) {
            return next({
                status: 404,
                type: 'not found',
                error: new Error('Schedule not found')
            });
        }
        res.json({ message: 'Schedule deleted successfully' });
    } catch (error) {
        next({
            status: 500,
            type: 'database error',
            error: error
        });
    }
};
export const removePrayerFromSchedule = async (req, res, next) => {
    try {
        const { scheduleId, prayerId } = req.params; // מזהה הלוח ומזהה התפילה הספציפית

        const updatedSchedule = await Schedule.findByIdAndUpdate(
            scheduleId,
            { $pull: { prayers: { _id: prayerId } } }, // מוחק את התפילה מהמערך לפי ה-ID שלה
            { new: true }
        );

        if (!updatedSchedule) {
            return next({
                status: 404,
                type: 'not found',
                error: new Error('Schedule or prayer not found')
            });
        }

        res.json(updatedSchedule);
    } catch (error) {
        next({
            status: 500,
            type: 'database error',
            error: error
        });
    }
};