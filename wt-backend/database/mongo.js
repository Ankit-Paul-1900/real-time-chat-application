import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const dbConnect=async()=>{
    try{
        console.log("Connecting to MongoDB...",process.env.MONGODB_URI);
         if(!process.env.MONGODB_URI){
            throw new Error("MONGODB_URI is not defined in environment variables");
         }
        const conn=await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Connected: ",conn.connection.host);
    }
    catch(error){
        console.log("Error in connecting to database",error);
    }
}
export  default dbConnect;