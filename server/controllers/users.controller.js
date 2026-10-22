import bcrypt from 'bcrypt';
import { User } from '../models/user.model.js';
import {createToken} from '../services/jwt.service.js';

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
        const { username } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return next({ 
                status: 400, 
                type: 'validation error', 
                error: { message: 'שם המשתמש כבר קיים במערכת, אנא בחר שם משתמש אחר' } 
            });
        }

        const user = new User(req.body);
        await user.save();

        const token = createToken(user);

        res.json({ username: user.username, role: user.role, token });
    } catch (error) {
        next({ status: 500, error, type: 'server error' });
    }
};

export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return next({ 
                status: 401, 
                type: 'unauthorized', 
                error: { message: 'שם משתמש או סיסמה שגויים' } 
            });
        }

        //comparing the password with the hashed password in the database
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return next({ 
                status: 401, 
                type: 'unauthorized', 
                error: { message: 'שם משתמש או סיסמה שגויים' } 
            });
        }
        const token = createToken(user);
        res.json({ username: user.username, role: user.role, token });

    } catch (error) {
        next({ status: 500, error, type: 'server error' });
    }
};
