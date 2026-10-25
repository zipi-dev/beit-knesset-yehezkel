import { model, Schema } from "mongoose";

const rabbiSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    trim: true
  }
});

// Only one rabbi can be the main rabbi
export const Rabbi = model('Rabbi', rabbiSchema);