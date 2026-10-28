import { Router } from "express";
import {deleteShiur,addShiur,getShiurById, getTitlesSuggestions, getAllShiurim,updateShiur} from "../controllers/shiurim.controllers.js";
import { verifyToken, requireRole } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { addShiurSchema, updateShiurSchema } from "../validators/shiur.validator.js";


const router = Router();
router.get('/', getAllShiurim);
router.get('/suggestions', getTitlesSuggestions);
router.get('/:id', getShiurById);
router.post('/', verifyToken, requireRole('admin', 'rabbi'), validate(addShiurSchema), addShiur);
router.put('/:id', verifyToken, requireRole('admin', 'rabbi'), validate(updateShiurSchema), updateShiur);
router.delete('/:id', verifyToken, requireRole('admin', 'rabbi'), deleteShiur);


export default router;