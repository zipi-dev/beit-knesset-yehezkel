import { isValidObjectId } from "mongoose";
import {Rabbi} from "../models/rabbi.model.js";

export const getAllRabbis = async (req, res, next) => {
    try {
        const rabbis = await Rabbi.find({});
        res.status(200).json(rabbis);
    } catch (err) {
        next({ status: 500, error: err, type: 'server error' });
    }
};

export const addRabbi = async (req, res, next) => {
    try {
        const newRabbi = new Rabbi(req.body);
        await newRabbi.save();
        res.status(201).json(newRabbi);
    } catch (err) {
        next({ status: 500, error: err, type: 'server error' });
    }
};

export const deleteRabbi = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return next({
                error: new Error('Invalid ID format'),
                type: 'validation error',
                status: 400
            });
        }
        
        const deletedRabbi = await Rabbi.findByIdAndDelete(id);
        if (!deletedRabbi) {
            return next({
                error: new Error('Rabbi not found'),
                type: 'resource not found error',
                status: 404
            });
        }
        
        res.status(204).send(); 
    } catch (err) {
        next({ status: 500, error: err, type: 'server error' });
    }
};

export const updateRabbi = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return next({
                error: new Error('Invalid ID format'),
                type: 'validation error',
                status: 400
            });
        }
        const updatedRabbi = await Rabbi.findByIdAndUpdate(id, req.body, {
            new: true,   // Return the updated document 
            runValidators: true // Ensure that the update adheres to the schema's validation rules
        });

        if (!updatedRabbi) {
            return next({
                error: new Error('Rabbi not found'),
                type: 'resource not found error',
                status: 404
            });
        }
        res.status(200).json(updatedRabbi);
    } catch (err) {
        next({ status: 500, error: err, type: 'server error' });
    }
};

