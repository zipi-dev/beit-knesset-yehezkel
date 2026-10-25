import { Router } from "express";
import {getAllRabbis, deleteRabbi, updateRabbi} from "../controllers/rabbi.controllers.js";
import { verifyToken, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();
router.get('/', getAllRabbis);
router.put('/:id', verifyToken, requireRole('admin', 'rabbi'), updateRabbi);
router.delete('/:id', verifyToken, requireRole('admin'), deleteRabbi);

export default router;