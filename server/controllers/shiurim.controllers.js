import {Shiur} from "../models/shiurim.model.js";
import { isValidObjectId } from "mongoose";

export const deleteShiur = async (req, res, next) => {
    try {
    const { id } = req.params; 
    if (!isValidObjectId(id)) {
      return next({
        error: new Error('Shiur not found'),
        type: 'resource not found error',
        status: 404
      });
    }
    const deletedShiur = await Shiur.findByIdAndDelete(id);
    if (deletedShiur) {
      return res.status(204).send();
    }
    return next({
      error: new Error('Shiur not found'),
      type: 'resource not found error',
      status: 404
    });

  } catch (err) {
    next({ status: 500, error: err, type: 'server error' });
  }


};

export const addShiur = async (req, res, next) => {
    try {
        const newShiur = new Shiur(req.body);
                await newShiur.save();
        res.status(201).json(newShiur);
    } catch (err) {
        next({ status: 500, error: err, type: 'server error' });
    }
};
