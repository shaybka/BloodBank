import mongoose from "mongoose";
const { Schema } = mongoose;

const Blood_Inventory_Schema = new Schema({
    blood_type: {
        type: String,
        required: true,
        enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] // Validates blood types
    },
    quantity: {
        type: Number,
        required: true,
        min: 0 // Ensures quantity cannot be negative
    },
    storage_location: {
        type: String,
        required: true
    },
    expiry_date: {
        type: Date,
        required: true
    }
}, { timestamps: true });

const BloodInventoryModel = mongoose.model("BloodInventory", Blood_Inventory_Schema);
export default BloodInventoryModel;
