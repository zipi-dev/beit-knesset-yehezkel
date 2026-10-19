import { model, Schema } from "mongoose";

const userSchema = new Schema({
    name: String,
    email: String,  
    password: String,
    role: String,
    rabbiProfile: {
        type: Schema.Types.ObjectId,
        ref: 'Rabbi',
        default: null
    }
});

export const User = model('User', userSchema);