import { Router } from "express";
import {getAllRabbis,addRabbi,deleteRabbi,updateRabbi} from "../controllers/rabbi.controllers.js"; 

const router = Router();
router.get('/', getAllRabbis);
router.post('/', addRabbi);
router.delete('/:id', deleteRabbi);
router.put('/:id', updateRabbi);

export default router;
