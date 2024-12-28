import mongoose from "mongoose";
import {MONGO_URI} from"./config.js";

// Connect to MongoDB
const ConnectDB  = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI,);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    }catch(e){
        console.error(`Error connecting to MongoDB: ${e.message}`);
        process.exit(1);
    }
}
export default ConnectDB;