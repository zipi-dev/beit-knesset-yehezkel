import {Router} from "express";
import {getAllCitiesZmanim} from "../controllers/zmanim.controllers.js";

const router = Router();

router.get("/", getAllCitiesZmanim);

export default router;