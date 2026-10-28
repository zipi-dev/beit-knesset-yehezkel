// createSchedule  (POST)   - מנהל: יצירת לוח עם מערך תפילות
// getActiveSchedule (GET)  - לקוחות: הלוח שסומן isActive: true
// getAllSchedules (GET)    - מנהל: כל הלוחות
// getScheduleById (GET)    - מנהל: לוח בודד (לטופס עריכה)
// updateSchedule  (PUT)    - מנהל: עריכה, כולל הפעלת לוח
// deleteSchedule  (DELETE) - מנהל: מחיקת לוח
// addPrayerToSchedule (POST) - מנהל: הוספת תפילה אחת לסוף הלוח
// removePrayerFromSchedule (DELETE) - מנהל: הסרת תפילה אחת מהלוח
import { Schedule } from "../models/schedule.model.js"; // הייבוא הזה חסר היה, ולכן כל הפונקציות נכשלו

const isCastError = (error) => error.name === "CastError";
const isValidationError = (error) => error.name === "ValidationError";

// רק לוח אחד יכול להיות פעיל: כשמפעילים לוח, מכבים את כל האחרים
const deactivateOthers = (activeId) =>
    Schedule.updateMany({ _id: { $ne: activeId }, isActive: true }, { isActive: false });

export const createSchedule = async (req, res, next) => {
    try {
        const savedSchedule = await new Schedule(req.body).save();
        if (savedSchedule.isActive) await deactivateOthers(savedSchedule._id);
        res.status(201).json(savedSchedule);
    } catch (error) {
        next({
            status: isValidationError(error) ? 400 : 500,
            type: isValidationError(error) ? "Validation Error" : "Server Error",
            error
        });
    }
};

// מה שהמתפללים רואים באתר
export const getActiveSchedule = async (req, res, next) => {
    try {
        const activeSchedule = await Schedule.findOne({ isActive: true });
        if (!activeSchedule) {
            return next({ status: 404, type: "Not Found", error: new Error("No active schedule found") });
        }
        res.status(200).json(activeSchedule);
    } catch (error) {
        console.error("שגיאה אמיתית בשרת:", error);
        next({ status: 500, type: "Server Error", error });
    }
};

export const getAllSchedules = async (req, res, next) => {
    try {
        const schedules = await Schedule.find().sort({ createdAt: -1 });
        res.status(200).json(schedules);
    } catch (error) {
        
        next({ status: 500, type: "Server Error", error });
    }
};

export const getScheduleById = async (req, res, next) => {
    try {
        const schedule = await Schedule.findById(req.params.id);
        if (!schedule) {
            return next({ status: 404, type: "Not Found", error: new Error("Schedule not found") });
        }
        res.status(200).json(schedule);
    } catch (error) {
        next({
            status: isCastError(error) ? 400 : 500,
            type: isCastError(error) ? "Invalid ID" : "Server Error",
            error
        });
    }
};

export const updateSchedule = async (req, res, next) => {
    try {
        const updatedSchedule = await Schedule.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedSchedule) {
            return next({ status: 404, type: "Not Found", error: new Error("Schedule not found") });
        }
        if (updatedSchedule.isActive) await deactivateOthers(updatedSchedule._id);
        res.status(200).json(updatedSchedule);
    } catch (error) {
        next({
            status: isValidationError(error) || isCastError(error) ? 400 : 500,
            type: isValidationError(error) ? "Validation Error" : isCastError(error) ? "Invalid Data" : "Server Error",
            error
        });
    }
};

export const deleteSchedule = async (req, res, next) => {
    try {
        const deletedSchedule = await Schedule.findByIdAndDelete(req.params.id);
        if (!deletedSchedule) {
            return next({ status: 404, type: "Not Found", error: new Error("Schedule not found") });
        }
        res.status(200).json({ message: 'Schedule deleted successfully' });
    } catch (error) {
        next({
            status: isCastError(error) ? 400 : 500,
            type: isCastError(error) ? "Invalid ID" : "Server Error",
            error
        });
    }
};

export const addPrayerToSchedule = async (req, res, next) => {
    try {
        // $push מוסיף את התפילה (req.body, כבר מאומתת) לסוף מערך prayers בלי לגעת בשאר התפילות
        const updatedSchedule = await Schedule.findByIdAndUpdate(
            req.params.scheduleId,
            { $push: { prayers: req.body } },
            { new: true, runValidators: true }
        );

        if (!updatedSchedule) {
            return next({ status: 404, type: "Not Found", error: new Error("Schedule not found") });
        }
        res.status(201).json(updatedSchedule); // מחזירים את הלוח המעודכן, והתפילה החדשה בסוף המערך
    } catch (error) {
        next({
            status: isValidationError(error) || isCastError(error) ? 400 : 500,
            type: isValidationError(error) ? "Validation Error" : isCastError(error) ? "Invalid Data" : "Server Error",
            error
        });
    }
};

export const removePrayerFromSchedule = async (req, res, next) => {
    try {
        const { scheduleId, prayerId } = req.params;

        // התנאי 'prayers._id' מבטיח שגם הלוח וגם התפילה קיימים, אחרת מקבלים null ו-404
        const updatedSchedule = await Schedule.findOneAndUpdate(
            { _id: scheduleId, 'prayers._id': prayerId },
            { $pull: { prayers: { _id: prayerId } } },
            { new: true }
        );

        if (!updatedSchedule) {
            return next({ status: 404, type: "Not Found", error: new Error("Schedule or prayer not found") });
        }
        res.status(200).json(updatedSchedule);
    } catch (error) {
        next({
            status: isCastError(error) ? 400 : 500,
            type: isCastError(error) ? "Invalid ID" : "Server Error",
            error
        });
    }
};