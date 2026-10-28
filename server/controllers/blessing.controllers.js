import { isValidObjectId } from "mongoose";
import { Blessing } from "../models/blessing.model.js";

export const createBlessing = async (req, res, next) => {
    try {
        const newBlessing = new Blessing(req.body);
        await newBlessing.save();
        res.status(201).json(newBlessing);
    } catch (err) {
        next({ status: 500, error: err, type: 'server error' });
    }
};

export const getLatestBlessings = async (req, res, next) => {
    try {
        const blessings = await Blessing.find()
            .sort({ createdAt: -1 }) 
            .limit(15);  

        res.status(200).json({
            success: true,
            data: blessings
        });
    } catch (err) {
        next({ status: 500, error: err, type: 'server error' });
    }
};


// מנהל: כל הבקשות
export const getAllBlessingsAdmin = async (req, res, next) => {
    try {
        const blessings = await Blessing.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: blessings });
    } catch (err) {
        next({ status: 500, error: err, type: 'server error' });
    }
};

// מנהל: מחיקת בקשה
export const deleteBlessing = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return next({ status: 404, type: 'not found', error: { message: 'הברכה לא נמצאה' } });
        }
        const deleted = await Blessing.findByIdAndDelete(id);
        if (!deleted) {
            return next({ status: 404, type: 'not found', error: { message: 'הברכה לא נמצאה' } });
        }
        res.status(200).json({ message: 'הברכה נמחקה בהצלחה' });
    } catch (err) {
        next({ status: 500, error: err, type: 'server error' });
    }
};
