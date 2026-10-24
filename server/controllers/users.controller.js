import bcrypt from 'bcrypt';
import { User } from '../models/user.model.js';
import {createToken} from '../services/jwt.service.js';
import { createHash,timingSafeEqual } from 'crypto';
import { env } from '../config/env.js';
import { Rabbi } from '../models/rabbi.model.js';
import { isValidObjectId } from 'mongoose';


// Compare two values in a timing-safe manner to prevent timing attacks
const hash = (value) => createHash('sha256').update(String(value)).digest(); //Get text and convert it to a hash using the SHA-256 algorithm
const isSame = (a, b) => timingSafeEqual(hash(a), hash(b));

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find()
            .select('-password')
            .populate('rabbiProfile', 'name');
        res.json(users);
    } catch (error) {
        next({ status: 500, error, type: 'server error' });
    }
};

export const register = async (req, res, next) => {
    let newRabbi = null;
    try {
        const { username, password, role, rabbi } = req.body;

        // אסור ליצור משתמש עם שם המשתמש של המנהל הראשי
        if (username === env.SUPER_ADMIN_USERNAME) {
            return next({
                status: 400,
                type: 'validation error',
                error: { message: 'שם המשתמש כבר קיים במערכת, אנא בחר שם משתמש אחר' }
            });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return next({
                status: 400,
                type: 'validation error',
                error: { message: 'שם המשתמש כבר קיים במערכת, אנא בחר שם משתמש אחר' }
            });
        }

        // Create a new rabbi profile if the role is 'rabbi'
        let rabbiProfile = null;
        if (role === 'rabbi') {
            newRabbi = await Rabbi.create(rabbi);
            rabbiProfile = newRabbi._id;
        }

        const user = new User({ username, password, role, rabbiProfile });
        await user.save();

        res.status(201).json({
            _id: user._id,
            username: user.username,
            role: user.role,
            rabbiProfile: user.rabbiProfile
        });
    } catch (error) {
        // If a rabbi profile was created but the user creation failed, delete the rabbi profile to avoid orphaned records
        if (newRabbi) {
            await Rabbi.findByIdAndDelete(newRabbi._id).catch(() => {});
        }

        //If admin touch twice the same username
        if (error.code === 11000) {
            return next({
                status: 400,
                type: 'validation error',
                error: { message: 'שם המשתמש כבר קיים במערכת, אנא בחר שם משתמש אחר' }
            });
        }
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
        if (!isValidObjectId(id)) {
            return next({
                status: 404,
                type: 'not found',
                error: { message: 'המשתמש לא נמצא' }
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return next({
                status: 404,
                type: 'not found',
                error: { message: 'המשתמש לא נמצא' }
            });
        }

        const { username, password } = req.body;

        //Not allowed to change the username to the super admin username
        if (username && username !== user.username) {
            const taken =
                username === env.SUPER_ADMIN_USERNAME ||
                await User.exists({ username });
            if (taken) {
                return next({
                    status: 400,
                    type: 'validation error',
                    error: { message: 'שם המשתמש כבר קיים במערכת, אנא בחר שם משתמש אחר' }
                });
            }
            user.username = username;
        }

        if (password) {
            user.password = password;
        }

        await user.save();

        res.json({
            _id: user._id,
            username: user.username,
            role: user.role,
            rabbiProfile: user.rabbiProfile
        });
    } catch (error) {
        if (error.code === 11000) {
            return next({
                status: 400,
                type: 'validation error',
                error: { message: 'שם המשתמש כבר קיים במערכת, אנא בחר שם משתמש אחר' }
            });
        }
        next({ status: 500, error, type: 'server error' });
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return next({
                status: 404,
                type: 'not found',
                error: { message: 'המשתמש לא נמצא' }
            });
        }

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