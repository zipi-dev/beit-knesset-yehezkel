//router
import { Router } from "express";
import { addOpinion, getAllOpinions, deleteOpinion, addLike} from "../controllers/opinion.controller.js";
import { validateOpinion ,requireVisitorId } from "../middlewares/opinion.middleware.js";

const router = Router();

//client
router.get("/", getAllOpinions);
//manager
router.post("/", validateOpinion, addOpinion);
//manager
router.delete("/:id",  deleteOpinion );//TODO: add  middleware of manager
//client
router.post("/:id/likes", requireVisitorId, addLike);

export default router;