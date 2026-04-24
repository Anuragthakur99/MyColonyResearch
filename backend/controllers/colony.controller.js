import { Colony } from "../models/colony.model.js";
import { User } from "../models/user.model.js";

export const createColony = async (req, res) => {
    try {
        const { name, description, address, city, pincode, totalFlats, amenities } = req.body;
        
        if (!name || !description || !address || !city || !pincode) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        const colony = await Colony.create({
            name,
            description,
            address,
            city,
            pincode,
            totalFlats,
            amenities: amenities || [],
            adminId: req.id
        });

        return res.status(201).json({
            message: "Colony created successfully",
            colony,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

export const getAllColonies = async (req, res) => {
    try {
        const colonies = await Colony.find().populate('adminId', 'fullname email');
        return res.status(200).json({
            colonies,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

export const getColonyById = async (req, res) => {
    try {
        const colonyId = req.params.id;
        const colony = await Colony.findById(colonyId).populate('adminId', 'fullname email');
        
        if (!colony) {
            return res.status(404).json({
                message: "Colony not found",
                success: false
            });
        }

        return res.status(200).json({
            colony,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

export const updateColony = async (req, res) => {
    try {
        const { name, description, address, city, pincode, totalFlats, amenities } = req.body;
        const colonyId = req.params.id;

        const colony = await Colony.findByIdAndUpdate(
            colonyId,
            { name, description, address, city, pincode, totalFlats, amenities },
            { new: true }
        );

        if (!colony) {
            return res.status(404).json({
                message: "Colony not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Colony updated successfully",
            colony,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

export const deleteColony = async (req, res) => {
    try {
        const colonyId = req.params.id;
        const colony = await Colony.findByIdAndDelete(colonyId);

        if (!colony) {
            return res.status(404).json({
                message: "Colony not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Colony deleted successfully",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};