import bcrypt from 'bcrypt';
import { User } from '../models/user.model.js';
import {createToken} from '../services/jwt.service.js';
import { createHash,timingSafeEqual } from 'crypto';
import { env } from '../config/env.js';


// Compare two values in a timing-safe manner to prevent timing attacks
const hash = (value) => createHash('sha256').update(String(value)).digest(); //Get text and convert it to a hash using the SHA-256 algorithm
const isSame = (a, b) => timingSafeEqual(hash(a), hash(b));

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

        // Check if the provided username and password match the super admin dentials
        const usernameOk = isSame(username, env.SUPER_ADMIN_USERNAME);
        const passwordOk = isSame(password, env.SUPER_ADMIN_PASSWORD);

        if (env.SUPER_ADMIN_USERNAME && env.SUPER_ADMIN_PASSWORD && usernameOk && passwordOk) {
            const token = createToken({ _id: 'admin', role: 'admin' });
            return res.json({ username, role: 'admin', token });
        }

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

export const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
    // Check if the user exists and update the user        
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { 
            new: true, 
            runValidators: true 
        });

        if (!updatedUser) {
            return next({ 
                status: 404, 
                type: 'not found', 
                error: { message: 'המשתמש לא נמצא' } 
            });
        }
        res.json(updatedUser);
    } catch (error) {
        next({ status: 500, error, type: 'server error' });
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return next({ 
                status: 404, 
                type: 'not found', 
                error: { message: 'המשתמש לא נמצא' } 
            });
        }
        res.json({ message: 'המשתמש נמחק בהצלחה' });
    } catch (error) {
        next({ status: 500, error, type: 'server error' });
    }
};