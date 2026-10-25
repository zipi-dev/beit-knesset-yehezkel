//router
import { Router } from "express";
import { addOpinion, getAllOpinions, deleteOpinion } from "../controllers/opinion.controller.js";
import { validateOpinion } from "../middlewares/opinion.middleware.js";

const router = Router();


router.get("/", getAllOpinions);
router.post("/", validateOpinion, addOpinion);
router.delete("/:id",  deleteOpinion );

export default router;