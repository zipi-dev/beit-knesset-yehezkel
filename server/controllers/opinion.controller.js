//Opinion of people about the events that took place in the synagogue
//הפונקציות שצריך
//getAllOpinions for clients - get
//getOpinionById for manager - get ?
//addOpinion for clients - post
//deleteOpinion for manager - delete
//updateOpinion for manager - put??????

import { Opinion } from "../models/opinion.model.js";

export const getAllOpinions = async (req, res, next) => {
    try {
        const opinions = await Opinion.find().populate('userId', 'name email').populate('eventId', 'name eventDate');// Populate userId and eventId to get user name, email, and event details

        res.status(200).json(opinions);
    } catch (error) {
    
        next({
        status: 500,
        type: 'database error',
        error: error // מעביר את השגיאה המקורית יחד עם ה-stack trace שלה
    });
    }


};

export const addOpinion = async (req, res, next) => {
    try {
        const newOpinion = new Opinion(req.body);
        const savedOpinion = await newOpinion.save();
        res.status(201).json(savedOpinion);
    } catch (error) {
        next({ status: 500, type: "Error adding opinion" ,error: error});   
    }
};
export const deleteOpinion = async (req, res, next) => {
    try {
        const deletedOpinion = await Opinion.findByIdAndDelete(req.params.id);
        if (!deletedOpinion) {
          return next({
                status: 404,
                error: new Error('Opinion not found'),  
                type: 'not found error'
            });
        }
        res.status(200).json({ message: 'Opinion deleted successfully' });
    } catch (error) {
        next({ status: 500, type: "Error deleting opinion" ,error: error}); 
};
}

 