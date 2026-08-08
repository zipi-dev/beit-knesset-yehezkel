import { connect } from "mongoose";
import { env } from "./env.js";

export const connectDB = async () => {
    try {
        await connect(env.MONGO_URI);
        console.log('mongo connected succesfully');
    } catch (error) {
        console.log(error);
        process.exit(1);// סגירת השרת עם סטטוס של שגיאה
    }
};
