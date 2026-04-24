import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Food & Tiffin', 'Laundry', 'Cleaning', 'Grocery', 'Maintenance', 'Tutoring', 'Pet Care', 'Other']
    },
    price: {
        type: String,
        required: true
    },
    availability: {
        type: String,
        default: 'Not specified'
    },
    images: [{
        type: String
    }],
    menu: [{
        item: String,
        price: String
    }],
    serviceProvider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    colony: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Colony',
        required: true
    },
    isActive: {
        type: Boolean,
        default: false
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        default: 0
    },
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: Number,
        comment: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

export const Service = mongoose.model("Service", serviceSchema);