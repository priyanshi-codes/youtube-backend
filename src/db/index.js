import mongoose from "mongoose";
import { DB_name } from "../constants.js";


/**
 * Asynchronously connects to the MongoDB database using the connection URI
 * from environment variables and logs the host on successful connection.
 * Exits the process if there's an error during the connection attempt.
 */

const connectDB = async ()=>{
    try {
        console.log("Connecting to MongoDB with URI:", process.env.MONGODB_URI);
       const connectionInstance=  await mongoose.connect(`${process.env.MONGODB_URI}/${DB_name}`)
       console.log(`\n MongoDB connected !! DB host : ${connectionInstance.connection.host}`)
        
    } catch (error) {
        console.log("MongoDB connection error",error);
        process.exit(1);
    }
}


export default connectDB;