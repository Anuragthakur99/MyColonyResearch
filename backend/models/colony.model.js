import mongoose from "mongoose";

const colonySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    totalFlats: {
        type: Number,
        default: 0
    },
    amenities: [{
        type: String
    }],
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

export const Colony = mongoose.model("Colony", colonySchema);