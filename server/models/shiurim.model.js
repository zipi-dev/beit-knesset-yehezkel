import { model, Schema } from "mongoose";

const shiurimSchema = new Schema({
    titleHebrew: {
    type: String,
    required: true,
    trim: true
  },
  titleEnglish: {
    type: String,
    trim: true
  },

  mediaUrl: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    required: true 
  },
  rabbi: {
    type: Schema.Types.ObjectId,
    ref: 'Rabbi' ,
    required: true
  }
})

shiurimSchema.index({ date: -1, _id: -1 });
shiurimSchema.index({ rabbi: 1, date: -1, _id: -1 });

shiurimSchema.index({ titleHebrew: 'text', titleEnglish: 'text' });

export const Shiur = model('Shiur', shiurimSchema);
