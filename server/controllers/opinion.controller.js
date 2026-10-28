// חוות דעת של מתפללים
// getAllOpinions / addOpinion / addLike - לקוחות | deleteOpinion - מנהל בלבד
import { Opinion } from "../models/opinion.model.js";

const isCastError = (error) => error.name === "CastError";
const isValidationError = (error) => error.name === "ValidationError";

export const getAllOpinions = async (req, res, next) => {
    try {
        const visitorId = req.get('x-visitor-id');
        const opinions = await Opinion.find().sort({ createdAt: -1 }).lean();

        // לא חושפים ללקוח את רשימת המזהים (likedBy), רק אם המבקר הנוכחי כבר נתן לייק
        const result = opinions.map(({ likedBy = [], ...opinion }) => ({
            ...opinion,
            likedByMe: visitorId ? likedBy.includes(visitorId) : false
        }));

        res.status(200).json(result);
    } catch (error) {
        next({ status: 500, type: "Server Error", error });
    }
};

export const addOpinion = async (req, res, next) => {
    try {
        const savedOpinion = await new Opinion(req.body).save();
        res.status(201).json(savedOpinion);
    } catch (error) {
        next({
            status: isValidationError(error) ? 400 : 500,
            type: isValidationError(error) ? "Validation Error" : "Server Error",
            error
        });
    }
};

export const deleteOpinion = async (req, res, next) => {
    try {
        const deletedOpinion = await Opinion.findByIdAndDelete(req.params.id);
        if (!deletedOpinion) {
            return next({ status: 404, type: "Not Found", error: new Error("Opinion not found") });
        }
        res.status(200).json({ message: 'Opinion deleted successfully' });
    } catch (error) {
        next({
            status: isCastError(error) ? 400 : 500,
            type: isCastError(error) ? "Invalid ID" : "Server Error",
            error
        });
    }
};

export const addLike = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { visitorId } = req; // הגיע מ-requireVisitorId

        // פעולה אחת אטומית: מעלה לייק רק אם המבקר עדיין לא ברשימה.
        // גם לחיצה כפולה מהירה או בקשה ידנית - רק אחת תצליח.
        const opinion = await Opinion.findOneAndUpdate(
            { _id: id, likedBy: { $ne: visitorId } },
            { $inc: { likes: 1 }, $addToSet: { likedBy: visitorId } },
            { new: true }
        );

        if (!opinion) {
            // לא עודכן: או שאין חוות דעת כזו, או שהמבקר כבר נתן לייק
            const exists = await Opinion.exists({ _id: id });
            if (!exists) {
                return next({ status: 404, type: "Not Found", error: new Error("Opinion not found") });
            }
            return next({ status: 409, type: "Already Liked", error: new Error("כבר נתת לייק לחוות דעת זו") });
        }

        res.status(200).json({ message: 'Like added successfully', likes: opinion.likes, likedByMe: true });
    } catch (error) {
        next({
            status: isCastError(error) ? 400 : 500,
            type: isCastError(error) ? "Invalid ID" : "Server Error",
            error
        });
    }
};