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
next({status: 400, error: error ,type: "Validation Error"}); // Pass the error to the error handling middleware
    }
};
export const getAllEvents = async (req, res, next) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        next({status: 400, error: error ,type: "Validation Error"}); // Pass the error to the error handling middleware
    }
};
export const getEventById = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json(event);
    } catch (error) {
        next({status: 400, error: error ,type: "Validation Error"}); // Pass the error to the error handling middleware
    }
};
export const updateEvent = async (req, res, next) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(req.params
.id, req.body, { new: true });
        if (!updatedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json(updatedEvent);
    } catch (error) {
        next({status: 400, error: error ,type: "Validation Error"}); // Pass the error to the error handling middleware
    }
};
export const deleteEvent = async (req, res, next) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);
        if (!deletedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json({ message: 'Event deleted successfully' });
   } catch (error) {
        next({status: 400, error: error ,type: "Validation Error"}); // Pass the error to the error handling middleware
    }
};

