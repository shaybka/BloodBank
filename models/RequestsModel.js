import mongoose from 'mongoose';
const { Schema } = mongoose;

// Define the schema for blood requests
const Request_Schema = new Schema({
    hospital_id: {
        type: Schema.Types.ObjectId,
        ref: "Hospital", // References the Hospital model
        required: true
    },
    blood_type: {
        type: String,
        required: true,
        enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    },
    quantity: {
        type: Number,
        required: true,
        min: 1 // At least 1 unit of blood must be requested
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "completed", "cancelled"],
        default: "pending"
    },
    request_date: {
        type: Date,
        required: true,
        default: Date.now // Automatically set the current date
    },
    completion_date: {
        type: Date
    }
}, { timestamps: true });

const RequestModel = mongoose.model("Request", Request_Schema);
export default RequestModel;
