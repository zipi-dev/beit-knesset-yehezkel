import { Router } from "express";
import { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent } from "../controllers/event.controllers.js";
import { validateEvent } from "../middlewares/event.middleware.js";

const router = Router();
//manager
// לקוחות
router.get("/", getAllEvents);
router.get("/:id", getEventById);
 
// מנהל בלבד - TODO: להוסיף כאן את ה-middleware של ההתחברות
router.post("/", validateEvent, createEvent);
router.put("/:id", validateEvent, updateEvent);
router.delete("/:id", deleteEvent); // בלי validateEvent: למחיקה אין body
 
export default router;