import { Router } from "express";
import { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent,uploadEventImage } from "../controllers/event.controllers.js";
import { validateEvent } from "../middlewares/event.middleware.js";
import { verifyToken, requireRole } from "../middlewares/auth.middleware.js";
import { uploadImage } from "../middlewares/upload.middleware.js";

const router = Router();
//manager
const adminOnly = [verifyToken, requireRole('admin')];
// לקוחות
router.get("/", getAllEvents);

 
// מנהל בלבד - TODO: להוסיף כאן את ה-middleware של ההתחברות
router.post("/upload-image", ...adminOnly, uploadImage, uploadEventImage);
router.get("/:id",...adminOnly, getEventById);
router.post("/", ...adminOnly, validateEvent, createEvent);
router.put("/:id", ...adminOnly, validateEvent, updateEvent);
router.delete("/:id", ...adminOnly, deleteEvent); 
 
export default router;