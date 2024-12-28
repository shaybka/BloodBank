import mongoose, { Schema } from "mongoose";
import validator from "validator";
import bcrypt from 'bcrypt';

const user_schema = new Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        validate: [validator.isEmail, "Please enter a valid email"]
    },
    userName: {
        type: String,
        required: true,
        lowercase: true,
        minlength: 3,
        maxlength: 20
    },
    password: {
        type: String,
        required: true,
        select: false,
        validate: [
            {
                validator: value => validator.isStrongPassword(value),
                message: "Password should contain at least 1 lowercase, 1 uppercase, 1 number, 1 special character and should be at least 8 characters long"
            }
        ]
    },
 
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
}, {
    timestamps: true
});

user_schema.pre("save", async function(next){
   if(!this.isModified("password")) return next();
   const salt = await bcrypt.genSalt(10);
   this.password = await bcrypt.hash(this.password, salt);
    next();
});

user_schema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", user_schema);

export default User;