import bcrypt from 'bcrypt';
import { User } from '../models/user.model.js';
import {createToken} from '../services/jwt.service.js';
import {env} from '../config/env.js';

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        next({ status: 500, error, type: 'server error' });
    }
};

export const register = async (req, res, next) => {
    try {
        const user = new User(req.body);
        await user.save();

        const token = createToken(user);

        res.json({ username: user.name, token });
    } catch (error) {
        next({ status: 500, error, type: 'server error' });
    }
};