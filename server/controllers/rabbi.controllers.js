import { isValidObjectId } from "mongoose";
import {Rabbi} from "../models/rabbi.model.js";

// The only fields a rabbi profile can be edited with.
const RABBI_FIELDS = ['name', 'imageUrl', 'bio'];
export const getAllRabbis = async (req, res, next) => {
    try {
        const rabbis = await Rabbi.find({});
        res.status(200).json(rabbis);
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

        if (req.myUser.role === 'rabbi') {
            const ownId = req.myUser.rabbiProfile?.toString();
            if (ownId !== id) {
                return next({
                    status: 403,
                    type: 'authorization error',
                    error: new Error('You do not have permission to update this rabbi')
                });
            }
        }

                const update = Object.fromEntries(
            RABBI_FIELDS.filter(f => req.body[f] !== undefined).map(f => [f, req.body[f]])
        );
        const updatedRabbi = await Rabbi.findByIdAndUpdate(id, update, {
            new: true,
            runValidators: true
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
