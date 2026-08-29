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

export const getShiurById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return next({
                error: new Error('Invalid ID format'),
                type: 'validation error',
                status: 400
            });
        }
        const shiur = await Shiur.findById(id);
        if (!shiur) {
            return next({
                error: new Error('Shiur not found'),
                type: 'resource not found error',
                status: 404
            });
        }
        res.status(200).json(shiur);
    } catch (err) {
        next({ status: 500, error: err, type: 'server error' });
    }
};


export const getTitlesSuggestions = async (req, res, next) => {
    try {
        const { search = '' } = req.query;
        if (!search.trim()) {
            return res.status(200).json([]);
        }
        const suggestions = await Shiur.find(
            { $text: { $search: search } }, 
            { titleHebrew: 1, titleEnglish: 1 }
        ).limit(10);
        res.status(200).json(suggestions);
    } catch (err) {
        next({ status: 500, error: err, type: 'server error' });
    }
};

export const getAllShiurim = async (req, res, next) => {
    try {
        const { category, search = '', page = 1, perPage = 15, sort = 'newest' } = req.query;

        const filter = {};

        if (category) {
            filter.categories = category;
        }

        if (search.trim()) {
            filter.$text = { $search: search }; 
        }

        const parsedPage = Number(page);
        const parsedLimit = Number(perPage);
        const sortDirection = sort === 'oldest' ? 1 : -1;

        const shiurim = await Shiur.find(filter)
            .sort({ date: sortDirection })   
            .skip((parsedPage - 1) * parsedLimit)
            .limit(parsedLimit);

        res.status(200).json(shiurim);

    } catch (err) {
        next({ status: 500, error: err, type: 'server error' });
    }
};

export const getAllCategories = async (req, res, next) => {
    try {
        // Use the distinct method to get unique categories from the Shiurim collection
        const categories = await Shiur.distinct('categories');
        res.status(200).json(categories);
    } catch (err) {
        next({ status: 500, error: err, type: 'server error' });
    }
};