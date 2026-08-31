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