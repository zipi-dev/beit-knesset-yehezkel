//router
import { Router } from "express";
import { createOpinion, getAllOpinions,  deleteOpinion  }
 from "../controllers/opinion.controller.js";
import { validateOpinion } from "../middlewares/opinion.middleware.js";

const router = Router();


router.get("/", getAllOpinions);
router.post("/", validateOpinion, createOpinion);
router.delete("/:id",  deleteOpinion );

export default router;