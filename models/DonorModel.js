import mongoose from "mongoose";
const { Schema } = mongoose;

const Donor_Schema = new Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    bloodGroup: { type: String, required: true },
    phone: { type: String, required: true, match: /^[0-9]{10,15}$/ },
    email: { type: String, required: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    address: { type: String, required: true },
    donationHistory: [
        {
            donation_id: { type: Schema.Types.ObjectId, ref: "Donation", required: true },
            date: { type: Date, required: true },
            quantity: { type: Number, required: true },
            location: { type: String, required: true }
        }
    ]
}, { timestamps: true });
const DonorModel = mongoose.model("Donor", Donor_Schema);
export default DonorModel;
