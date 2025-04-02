import mongoose from "mongoose";
import { DATABASE_NAME } from "../utils/constants.js";

export const connectDB = async () => {
    try {
        const response = await mongoose.connect(`${process.env.MONGODB_URI}/${DATABASE_NAME}`);
        console.log(`DATABASE CONNECTED ! HOST ${response.connection.host}`);
    } catch (error) {
        console.log(`Error occured while connecting to database ${error.message}`);
    }
}