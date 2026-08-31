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

export const Rabbi = model('Rabbi', rabbiSchema);