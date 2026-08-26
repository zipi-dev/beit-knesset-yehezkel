import { model, Schema } from "mongoose";

const shiurimSchema = new Schema({
    title: {
    type: String,
    required: true,
    trim: true
  },
  lecturer: {
    type: String,
    required: true,
    trim: true
  },
  categories: {
    type: [String],
    required: true,
    default: []
  },
  mediaUrl: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    required: true 
  }
})

shiurSchema.index({ date: -1 });

const Shiur = mongoose.model('Shiur', shiurSchema);

export default Shiur;