import mongoose from "mongoose";
const { Schema } = mongoose;

const Hospital_Schema = new Schema({
    name: {
        type: String, 
        required: true,
        unique: true,
        lowercase: true
    },
    location: {
        type: String,
        required: true
    },
    contact_info: {
        phone: {
            type: String,
            required: true,
            match: /^[0-9]{10,15}$/ // Validates phone number format
        },
        email: {
            type: String,
            required: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Validates email format
        }
    },
    partner_status: {
        type: String, 
        enum: ["unverified", "verified"],
        default: "unverified" // Default status for new hospitals
    }
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

const HospitalModel = mongoose.model("Hospital", Hospital_Schema);
export default HospitalModel;