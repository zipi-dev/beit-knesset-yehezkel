import { Router } from "express";
import {getAllUsers, register, login} from "../controllers/users.controller.js";
import {validate} from "../middlewares/validate.middleware.js"
import {registerSchema,loginSchema,updateUserSchema} from "../validators/user.validator.js"

const router = Router();
router.get("/", getAllUsers);
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

export default router;