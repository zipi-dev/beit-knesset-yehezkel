import { model, Schema } from "mongoose";
import bcrypt from 'bcrypt';
import { env } from "../config/env.js";

const userSchema = new Schema({
    username: { type: String, required: true, unique: true, trim: true },  
    password: String,
    role: String,
    rabbiProfile: {
        type: Schema.Types.ObjectId,
        ref: 'Rabbi',
        default: null
    }
});

userSchema.pre('save', async function () {
    // If the password field has not been modified, skip hashing
    if (!this.isModified('password')) return;

    const saltRounds = Number(env.BCRYPT_ROUNDS);
    this.password = await bcrypt.hash(this.password, saltRounds);
});

export const User = model('User', userSchema);