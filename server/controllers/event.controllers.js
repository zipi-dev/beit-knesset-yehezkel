//הפונקציות שצריך
//getAllEvents for clients
//getEventById for manager
//updateEvent for manager 
//deleteEvent for manager
//createEvent for manager - post
import { Event } from "../models/event.model.js";

export const createEvent = async (req, res, next) => {
    try {
        const newEvent = new Event(req.body);   
        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (error) {
next({ status: error.name === "ValidationError" ? 400 : 500,
            error: error,
            type: error.name === "ValidationError" ? "Validation Error" : "Server Error"}); // Pass the error to the error handling middleware
    }
};
//מיון לפי תאריך האירוע
export const getAllEvents = async (req, res, next) => {
    try {

        const events = await Event.find();
        events.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
        res.status(200).json(events);
    } catch (error) {
        next({status: 500, error: error ,type: "Server Error"}); // Pass the error to the error handling middleware
    }
};
export const getEventById = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
              return next({
                status: 404,
                error: new Error("Event not found"),
                type: "Not Found"
            });
        }
        res.status(200).json(event);
    } catch (error) {
        next({ status: error.name === "CastError" ? 400 : 500,
            error: error,
            type: error.name === "CastError" ? "Invalid ID" : "Server Error"}); 
    }
};
export const updateEvent = async (req, res, next) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(req.params
.id, req.body, { new: true, runValidators: true });
        if (!updatedEvent) {
             return next({
                status: 404,
                error: new Error("Event not found"),
                type: "Not Found"
            });
        }
        res.status(200).json(updatedEvent);
    } catch (error) {
        next({ status: error.name === "ValidationError" || error.name === "CastError" ? 400 : 500,
            error: error,
            type: error.name === "ValidationError" ? "Validation Error" :
                  error.name === "CastError" ? "Invalid Data" : "Server Error"}); 
    }
};
export const deleteEvent = async (req, res, next) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);
        if (!deletedEvent) {
             return next({
                status: 404,
                error: new Error("Event not found"),
                type: "Not Found"
            });
        }
        res.status(200).json({ message: 'Event deleted successfully' });
   } catch (error) {
        next({   status: error.name === "CastError" ? 400 : 500,
            error: error,
            type: error.name === "CastError" ? "Invalid ID" : "Server Error"}); 
    }
};

