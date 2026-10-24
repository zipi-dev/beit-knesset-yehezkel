import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/user.model.js';

export const verifyToken = async (req, res, next) => {
    try {
        //take the token from the header
        const header = req.headers.authorization;
        if (!header || !header.startsWith('Bearer ')) {
            return next({ status: 401, type: 'unauthorized', error: { message: 'נדרשת התחברות' } });
        }
        const token = header.split(' ')[1];

        //Verify the token
        let payload;
        try {
            payload = jwt.verify(token, env.JWT_SECRET_KEY);
        } catch {
            return next({ status: 401, type: 'unauthorized', error: { message: 'החיבור פג תוקף, אנא התחברי מחדש' } });
        }

        if (payload.userId === 'admin') {
            req.myUser = { _id: 'admin', role: 'admin' };
            return next();
        }
        //Find the user in the database
        const user = await User.findById(payload.userId).select('-password');
        if (!user) {
            return next({ status: 401, type: 'unauthorized', error: { message: 'המשתמש לא קיים' } });
        }
        req.myUser = user;
        next();
    } catch (error) {
        next({ status: 500, error, type: 'server error' });
    }
};

export const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.myUser || !allowedRoles.includes(req.myUser.role)) {
            return next({
                status: 403,
                type: 'authorization error',
                error: { message: 'אין לך הרשאה לבצע פעולה זו' }
            });
        }
        next();
    };
};