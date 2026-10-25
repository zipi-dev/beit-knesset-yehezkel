import { Router } from "express";
import {getAllUsers, register, login,updateUser,deleteUser} from "../controllers/users.controller.js";
import {validate} from "../middlewares/validate.middleware.js"
import {registerSchema,loginSchema,updateUserSchema} from "../validators/user.validator.js"
import { verifyToken,requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/",verifyToken,requireRole('admin'), getAllUsers);
router.post("/register", verifyToken, requireRole('admin'), validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.put("/:id", verifyToken, requireRole('admin'), validate(updateUserSchema), updateUser);
router.delete("/:id", verifyToken, requireRole('admin'), deleteUser);


export default router;