import mongoose from "mongoose";
const { Schema } = mongoose;

const Staff_Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
       
    },
    phone: {
        type: String,
        required: true,
        match: /^[0-9]{10,15}$/ // Validates phone number format
    },
    email: {
        type: String,
        required: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Validates email format
    },
    address: {
        type: String,
        required: true
    }
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

const StaffModel = mongoose.model("Staff", Staff_Schema);
export default StaffModel;