import jwt from "jsonwebtoken";
import { env } from '../config/env.js';

export const createToken = (user) => {
    const payload1 = { userId: user._id, userRole: user.role };
    const token = jwt.sign(payload1, env.JWT_SECRET_KEY);
    return token;
};