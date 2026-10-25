import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { Rabbi } from '../models/rabbi.model.js';

// Details of the main rabbi - change them before running
const MAIN_RABBI = {
    name: 'הרב אריה לוין שליט"א',
    bio: 'נינו וממשיך דרכו של אבי האסירים'
};

await connectDB();

// Safe to run more than once - it does not create a duplicate
let rabbi = await Rabbi.findOne({ name: MAIN_RABBI.name });
if (rabbi) {
    console.log('The rabbi already exists, nothing was created');
} else {
    rabbi = await Rabbi.create(MAIN_RABBI);
    console.log('The rabbi was created');
}

console.log(`Copy this line to your .env file:\nMAIN_RABBI_ID=${rabbi._id}`);
await mongoose.disconnect();