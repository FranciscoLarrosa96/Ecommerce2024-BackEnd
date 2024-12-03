import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email:
    {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        validate: {
            validator: (value: string) => {
                return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value);
            }
        },
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    img: {
        type: String,
    },
    role: {
        type: [String],
        default: ["USER"],
        enum: ["ADMIN", "USER"],
    }
});

export const UserModel = mongoose.model("User", userSchema);