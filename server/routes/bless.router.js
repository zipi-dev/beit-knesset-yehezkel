import { Router } from "express";
import rateLimit from 'express-rate-limit';
import { createBlessing, getLatestBlessings ,deleteBlessing, getAllBlessingsAdmin} from "../controllers/blessing.controllers.js";
import { validate } from "../middlewares/validate.middleware.js";
import { verifyToken, requireRole } from "../middlewares/auth.middleware.js";
import { blessingSchema } from "../validators/blessing.validator.js";

const router = Router();

// Up to 5 blessings from the same IP in 15 minutes
const blessingLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: { error: { message: 'שלחתם יותר מדי ברכות, נסו שוב בעוד כמה דקות' } }
});

router.get('/', getLatestBlessings);
router.post('/', blessingLimiter, validate(blessingSchema), createBlessing);
router.get('/admin/all', verifyToken, requireRole('admin'), getAllBlessingsAdmin);
router.delete('/:id', verifyToken, requireRole('admin'), deleteBlessing); 
export default router;