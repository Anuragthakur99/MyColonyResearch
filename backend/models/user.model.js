import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['resident', 'admin', 'user'],
        required: true
    },
    profile: {
        bio: {
            type: String
        },
        profilePhoto: {
            type: String,
            default: ""
        },
        address: {
            type: String
        },
        flatNumber: {
            type: String
        },
        skills: {
            type: [String],
            default: []
        }
    },
    colony: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Colony',
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);