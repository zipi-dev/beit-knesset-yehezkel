import { model, Schema } from "mongoose";
import bcrypt from 'bcrypt';
import { env } from "../config/env.js";

const userSchema = new Schema({
    name: String,
    username: { type: String, required: true, unique: true, trim: true },  
    password: String,
    role: String,
    rabbiProfile: {
        type: Schema.Types.ObjectId,
        ref: 'Rabbi',
        default: null
    }
});

userSchema.pre('save', async function (next) {
//If the password field has not been modified, skip hashing and proceed to the next middleware
    if (!this.isModified('password')) {
        return next();
    }
    
    try {
        const saltRounds = Number(env.BCRYPT_ROUNDS);
        this.password = await bcrypt.hash(this.password, saltRounds);
        next();
    } catch (error) {
        next(error);
    }
});

export const User = model('User', userSchema);