// getAllEvents - לקוחות | getEventById - מנהל | createEvent / updateEvent / deleteEvent - מנהל
import { Event } from "../models/event.model.js";

const isCastError = (error) => error.name === "CastError";
const isValidationError = (error) => error.name === "ValidationError";

export const createEvent = async (req, res, next) => {
    try {
        const savedEvent = await new Event(req.body).save();
        res.status(201).json(savedEvent);
    } catch (error) {
        next({
            status: isValidationError(error) ? 400 : 500,
            type: isValidationError(error) ? "Validation Error" : "Server Error",
            error
        });
    }
};

// מיון לפי תאריך האירוע (מהקרוב לרחוק) - במסד הנתונים
export const getAllEvents = async (req, res, next) => {
    try {
        const events = await Event.find().sort({ eventDate: 1 });
        res.status(200).json(events);
    } catch (error) {
        next({ status: 500, type: "Server Error", error });
    }
};

export const getEventById = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return next({ status: 404, type: "Not Found", error: new Error("Event not found") });
        }
        res.status(200).json(event);
    } catch (error) {
        next({
            status: isCastError(error) ? 400 : 500,
            type: isCastError(error) ? "Invalid ID" : "Server Error",
            error
        });
    }
};

export const updateEvent = async (req, res, next) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedEvent) {
            return next({ status: 404, type: "Not Found", error: new Error("Event not found") });
        }
        res.status(200).json(updatedEvent);
    } catch (error) {
        next({
            status: isValidationError(error) || isCastError(error) ? 400 : 500,
            type: isValidationError(error) ? "Validation Error" : isCastError(error) ? "Invalid Data" : "Server Error",
            error
        });
    }
};

export const deleteEvent = async (req, res, next) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);
        if (!deletedEvent) {
            return next({ status: 404, type: "Not Found", error: new Error("Event not found") });
        }
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        next({
            status: isCastError(error) ? 400 : 500,
            type: isCastError(error) ? "Invalid ID" : "Server Error",
            error
        });
    }
};

// העלאת תמונה ל-Cloudinary. מחזיר { url, publicId } - הלקוח שומר אותם יחד עם האירוע
export const uploadEventImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return next({ status: 400, type: "Upload Error", error: new Error("לא נבחרה תמונה") });
        }
        const image = await uploadImageBuffer(req.file.buffer);
        res.status(201).json(image);
    } catch (error) {
        next({ status: 500, type: "Upload Error", error });
    }
};
