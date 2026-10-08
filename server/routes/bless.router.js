import { Router } from "express";
import { createBlessing,getLatestBlessings } from "../controllers/blessing.controllers.js";
import { validateBlessing } from "../middlewares/blessing.middleware.js";

const router = Router();

router.get('/', getLatestBlessings);
router.post('/', validateBlessing, createBlessing);

export default router;

