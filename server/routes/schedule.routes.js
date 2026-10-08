import {Router} from "express";
import {createSchedule,getActiveSchedule, getAllSchedules,updateSchedule,deleteSchedule,removePrayerFromSchedule} from "../controllers/schedule.controllers.js";

const router = Router();

router.get("/", getAllSchedules);
router.get("/active", getActiveSchedule);
router.put("/:id", updateSchedule);
router.delete("/:id", deleteSchedule);
router.delete("/:scheduleId/prayer/:prayerId", removePrayerFromSchedule);


export default router;