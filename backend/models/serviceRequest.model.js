import mongoose from "mongoose";

const serviceRequestSchema = new mongoose.Schema({
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'completed'],
        default: 'pending'
    },
    scheduledDate: {
        type: Date
    },
    completedDate: {
        type: Date
    }
}, { timestamps: true });

export const ServiceRequest = mongoose.model("ServiceRequest", serviceRequestSchema);