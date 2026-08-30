import { Router } from "express";
import {deleteShiur,addShiur,getShiurById, getTitlesSuggestions, getAllShiurim,getAllCategories,updateShiur} from "../controllers/shiurim.controllers.js";

const router = Router();
router.get('/', getAllShiurim);
router.get('/categories', getAllCategories);
router.get('/suggestions', getTitlesSuggestions);
router.get('/:id', getShiurById);
router.post('/', addShiur);
router.put('/:id', updateShiur);
router.delete('/:id', deleteShiur);

export default router;