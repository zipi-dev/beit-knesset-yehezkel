import { model, Schema } from "mongoose";

const eventSchema = new Schema({
    name: { type: String, required: true, trim: true },        // שם האירוע
    eventDate: { type: Date, required: true },     // תאריך האירוע
    description: { text: { type: String, trim: true } }, // תיאור האירוע
    photographer: { type: String, trim: true },                        // מי צילם את האירוע
    mediaUrl: { type: String, trim: true } ,
    imageUrl: { type: String, trim: true },        // כתובת התמונה שהועלתה ל-Cloudinary
    imagePublicId: { type: String, trim: true }        // כתובת המדיה (למשל תמונה או וידאו)
});

export const Event = model('events', eventSchema);