import {Shiur} from "../models/shiurim.model.js";
import { isValidObjectId } from "mongoose";
import { Rabbi } from "../models/rabbi.model.js";
import { getCurParshiyot, clearFeaturedCache } from "../services/shiurimService.js";

//Function to check if the user is authorized to modify a shiur
const isAuthorizedToModifyShiur = (user, shiur) => {
    if (user.role === 'admin') return true;
    //If the user is a rabbi, check if the shiur belongs to him  
    if (user.rabbiProfile && shiur.rabbi && shiur.rabbi.toString() === user.rabbiProfile.toString()) {
        return true;
    }
    return false;
};

// The only fields the client is allowed to send. The "rabbi" field is handled separately, by role.
const SHIUR_FIELDS = ['titleHebrew', 'titleEnglish', 'mediaUrl', 'date'];

// Returns a new object containing only the allowed fields from the body
const pickFields = (body, fields) =>
    Object.fromEntries(
        fields.filter(f => body[f] !== undefined).map(f => [f, body[f]])
    );
// Escapes special regex characters so user input is treated as plain text
const escapeRegex = (text) => String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');


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

    const shiur = await Shiur.findById(id);
        if (!shiur) {
            return next({
                error: new Error('Shiur not found'),
                type: 'resource not found error',
                status: 404
            });
        }

    if (!isAuthorizedToModifyShiur(req.myUser, shiur)) {
                return next({
                status: 403,
                type: 'authorization error',
                error: new Error('You do not have permission to delete this shiur')
            });
        }
    await Shiur.findByIdAndDelete(id);
    clearFeaturedCache();
        return res.status(204).send();

    } catch (err) {
        next({ status: 500, error: err, type: 'server error' });
    }
    };   

export const addShiur = async (req, res, next) => {
    try {
        const data = pickFields(req.body, SHIUR_FIELDS);

        if (req.myUser.role === 'rabbi') {
            // A rabbi can only add shiurim under his own profile - the server decides, not the client
            data.rabbi = req.myUser.rabbiProfile;
        } else {
            // Admin: must choose an existing rabbi
            const rabbiId = req.body.rabbi;
            if (!isValidObjectId(rabbiId) || !(await Rabbi.exists({ _id: rabbiId }))) {
                return next({
                    status: 400,
                    type: 'validation error',
                    error: new Error('יש לבחור רב קיים')
                });
            }
            data.rabbi = rabbiId;
        }

        const newShiur = new Shiur(data);
        await newShiur.save();
        clearFeaturedCache();
        res.status(201).json(newShiur);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return next({ status: 400, type: 'validation error', error: err });
        }
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
        const shiur = await Shiur.findById(id).populate('rabbi'); //bring also the rabbi details    
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
        const search = String(req.query.search ?? '').trim();
        if (!search) {
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
        const { rabbi, page = 1, perPage = 15, sort = 'newest' } = req.query;
        const search = String(req.query.search ?? '').trim();

        if (rabbi && !isValidObjectId(rabbi)) {
            return next({
                status: 400,
                type: 'validation error',
                error: new Error('Invalid rabbi ID format')
            });
        }

        const filter = {};

        if (rabbi) {
            filter.rabbi = rabbi;
        }

        if (search) {
            const safeSearch = escapeRegex(search);

            const matchingRabbis = await Rabbi.find({
                name: { $regex: safeSearch, $options: 'i' }
            }).select('_id').lean();

            const rabbiIds = matchingRabbis.map(r => r._id);
            filter.$or = [
                { titleHebrew: { $regex: safeSearch, $options: 'i' } },
                { titleEnglish: { $regex: safeSearch, $options: 'i' } }
            ];

            if (rabbiIds.length > 0) {
                filter.$or.push({ rabbi: { $in: rabbiIds } });
            }
        }

        // Featured shiurim are relevant only for the general list (no search, no specific rabbi)
        let featuredData = { featuredShiurim: [], excludedIds: [] };
        if (!search && !rabbi) {
            featuredData = await getCurParshiyot();
        }

        // Excluded on every page, so they never appear twice
        if (featuredData.excludedIds.length > 0) {
            filter._id = { $nin: featuredData.excludedIds };
        }

        // Safe values: page is at least 1, and perPage is between 5 and 50
        const parsedPage = Math.max(1, parseInt(page, 10) || 1);
        const parsedLimit = Math.min(Math.max(parseInt(perPage, 10) || 15, 5), 50);
        const sortDirection = sort === 'oldest' ? 1 : -1;

        // The featured shiurim take part of the first page, so the first page still has perPage items in total
        const firstPageSize = parsedLimit - featuredData.featuredShiurim.length;
        const skip = parsedPage === 1 ? 0 : firstPageSize + (parsedPage - 2) * parsedLimit;
        const limit = parsedPage === 1 ? firstPageSize : parsedLimit;

        const shiurim = await Shiur.find(filter)
            .populate('rabbi') //bring also the rabbi details
            .sort({ date: sortDirection, _id: sortDirection }) // _id keeps the order stable when dates are equal
            .skip(skip)
            .limit(limit)
            .lean();

        // The featured shiurim appear only at the top of the first page
        const allShiurimCombined = parsedPage === 1
            ? [...featuredData.featuredShiurim, ...shiurim]
            : shiurim;

        res.status(200).json(allShiurimCombined);

    } catch (err) {
        next({ status: 500, error: err, type: 'server error' });
    }
};


export const updateShiur = async (req, res, next) => {
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

        if (!isAuthorizedToModifyShiur(req.myUser, shiur)) {
            return next({
                status: 403,
                type: 'authorization error',
                error: new Error('You do not have permission to update this shiur')
            });
        }

        // Only the admin may change which rabbi the shiur belongs to
        const allowed = req.myUser.role === 'admin'
            ? [...SHIUR_FIELDS, 'rabbi']
            : SHIUR_FIELDS;
        const update = pickFields(req.body, allowed);

                if ('rabbi' in update && (!isValidObjectId(update.rabbi) || !(await Rabbi.exists({ _id: update.rabbi })))) {
            return next({
                status: 400,
                type: 'validation error',
                error: new Error('יש לבחור רב קיים')
            });
        }

        const updatedShiur = await Shiur.findByIdAndUpdate(id, update, {
            new: true,
            runValidators: true
        });
        clearFeaturedCache();
        res.status(200).json(updatedShiur);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return next({ status: 400, type: 'validation error', error: err });
        }
        next({ status: 500, error: err, type: 'server error' });
    }
};
