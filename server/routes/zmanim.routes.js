import {Router} from "express";
import {getAllCitiesZmanim} from "../controllers/zmanim.controllers.js";

const router = Router();
//client
router.get("/", getAllCitiesZmanim);

export default router;