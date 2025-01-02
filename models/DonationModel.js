import mongoose from "mongoose";
const { Schema } = mongoose;

const Donation_Schema = Schema(
  {
    donor_id: { type: Schema.Types.ObjectId,
         ref: "Donor", required: true },
    blood_type: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    quantity: { type: Number, required: true, min: 1 },
    donation_date: { type: Date,  default: Date.now },
    location: { type: String,
        required: true
     },
    notes: { type: String },
  },
  { timestamps: true }
);

const DonationModel = mongoose.model("Donation", Donation_Schema);
export default DonationModel;
