import { Router } from "express";
import { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent } from "../controllers/event.controllers.js";
import { validateEvent } from "../middlewares/event.middleware.js";

const router = Router();

router.post("/", validateEvent, createEvent);
router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.put("/:id", validateEvent, updateEvent);
router.delete("/:id", validateEvent, deleteEvent);


export default router;