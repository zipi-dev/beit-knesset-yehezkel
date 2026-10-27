import { Router } from "express";
import {deleteShiur,addShiur,getShiurById, getTitlesSuggestions, getAllShiurim,updateShiur} from "../controllers/shiurim.controllers.js";
import { verifyToken, requireRole } from "../middlewares/auth.middleware.js";


const router = Router();
router.get('/', getAllShiurim);
router.get('/suggestions', getTitlesSuggestions);
router.get('/:id', getShiurById);
router.post('/', verifyToken, requireRole('admin', 'rabbi'), addShiur);
router.put('/:id', verifyToken, requireRole('admin', 'rabbi'), updateShiur);
router.delete('/:id', verifyToken, requireRole('admin', 'rabbi'), deleteShiur);


export default router;