import { model, Schema } from "mongoose";

const blessingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  motherName: {
    type: String,
    required: true,
    trim: true
  },
  blessingType: {
    type: String,
    required: true,
    enum: ['רפואה שלמה', 'זיווג הגון', 'פרנסה טובה', 'ברכה והצלחה','חזרה בתשובה']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

blessingSchema.index({ createdAt: -1 });
export const Blessing = model('Blessing', blessingSchema);
