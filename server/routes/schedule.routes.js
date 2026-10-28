import { Router } from "express";
import {
    createSchedule, getActiveSchedule, getAllSchedules, getScheduleById,
    updateSchedule, deleteSchedule, addPrayerToSchedule, removePrayerFromSchedule
} from "../controllers/schedule.controllers.js";
import { validateSchedule, validateScheduleUpdate, validatePrayer } from "../middlewares/schedule.middleware.js";
import { verifyToken, requireRole } from "../middlewares/auth.middleware.js";
const router = Router();
const adminOnly = [verifyToken, requireRole('admin')]; // מנהל בלבד
// לקוחות
router.get("/active", getActiveSchedule); // חייב לבוא לפני "/:id", אחרת "active" ייחשב כמזהה

// מנהל בלבד - TODO: להוסיף כאן את ה-middleware של ההתחברות
router.get("/",...adminOnly, getAllSchedules);
router.get("/:id", ...adminOnly, getScheduleById);
router.post("/", ...adminOnly, validateSchedule, createSchedule);
router.put("/:id", ...adminOnly, validateScheduleUpdate, updateSchedule);
router.delete("/:id", ...adminOnly, deleteSchedule);
router.post("/:scheduleId/prayer", ...adminOnly, validatePrayer, addPrayerToSchedule);
router.delete("/:scheduleId/prayer/:prayerId", ...adminOnly, removePrayerFromSchedule);

export default router;