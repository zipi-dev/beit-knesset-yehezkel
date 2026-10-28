//router
import { Router } from "express";
import { addOpinion, getAllOpinions, deleteOpinion, addLike} from "../controllers/opinion.controller.js";
import { validateOpinion ,requireVisitorId } from "../middlewares/opinion.middleware.js";
import { verifyToken, requireRole } from "../middlewares/auth.middleware.js";
const router = Router();

//client
router.get("/", getAllOpinions);
router.post("/", validateOpinion, addOpinion);
router.post("/:id/likes", requireVisitorId, addLike);

//manager
router.delete("/:id", verifyToken, requireRole('admin'), deleteOpinion );//TODO: add  middleware of manager


export default router;