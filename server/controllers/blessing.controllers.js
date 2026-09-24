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
