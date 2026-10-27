import { Router } from "express";
import {
    createSchedule, getActiveSchedule, getAllSchedules, getScheduleById,
    updateSchedule, deleteSchedule, addPrayerToSchedule, removePrayerFromSchedule
} from "../controllers/schedule.controllers.js";
import { validateSchedule, validateScheduleUpdate, validatePrayer } from "../middlewares/schedule.middleware.js";

const router = Router();

// לקוחות
router.get("/active", getActiveSchedule); // חייב לבוא לפני "/:id", אחרת "active" ייחשב כמזהה

// מנהל בלבד - TODO: להוסיף כאן את ה-middleware של ההתחברות
router.get("/", getAllSchedules);
router.get("/:id", getScheduleById);
router.post("/", validateSchedule, createSchedule);
router.put("/:id", validateScheduleUpdate, updateSchedule);
router.delete("/:id", deleteSchedule);
router.post("/:scheduleId/prayer", validatePrayer, addPrayerToSchedule);
router.delete("/:scheduleId/prayer/:prayerId", removePrayerFromSchedule);

export default router;