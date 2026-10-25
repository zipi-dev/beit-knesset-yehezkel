import { model, Schema } from "mongoose";

const eventSchema = new Schema({
    id: { type: Number, required: true },        // קוד האירוע
    name: { type: String, required: true },        // שם האירוע
    eventDate: { type: Date, required: true },     // תאריך האירוע
    description: {text:{ type: String, required: false }}, // תיאור האירוע
    photographer: String                           // מי צילם את האירוע
});

export const Event = model('events', eventSchema);