import { User } from "../models/user.model.js";
import { Colony } from "../models/colony.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import mongoose from "mongoose";

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role, colonyId } = req.body;
         
        if (!fullname || !email || !phoneNumber || !password || !role || !colonyId) {
            return res.status(400).json({
                message: "All required fields must be filled",
                success: false
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists with this email.',
                success: false,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let profilePhoto = "";
        if (req.file) {
            try {
                const fileUri = getDataUri(req.file);
                const uploadPromise = cloudinary.uploader.upload(fileUri.content);
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("Cloudinary upload timed out")), 10000)
                );
                const cloudResponse = await Promise.race([uploadPromise, timeoutPromise]);
                profilePhoto = cloudResponse.secure_url;
            } catch (uploadError) {
                console.log("File upload error:", uploadError.message);
                // Continue registration without profile photo
            }
        }

        // Verify the selected colony exists
        const selectedColony = await Colony.findById(colonyId);
        if (!selectedColony) {
            return res.status(400).json({
                message: "Selected colony not found",
                success: false
            });
        }

        const { address, flatNumber } = req.body;
        
        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            colony: colonyId,
            isVerified: true,
            profile: {
                profilePhoto,
                address: address || "",
                flatNumber: flatNumber || ""
            }
        });

        return res.status(201).json({
            message: "Account created successfully!",
            success: true
        });
    } catch (error) {
        console.log("Registration error:", error);
        return res.status(500).json({
            message: error.message || "Server error",
            success: false
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
                success: false
            });
        }

        let user = await User.findOne({ email }).populate('colony', 'name address');
        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password",
                success: false
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Invalid email or password",
                success: false
            });
        }

        // Auto-verify for now
        // if (!user.isVerified) {
        //     return res.status(400).json({
        //         message: "Account not verified. Please wait for admin approval.",
        //         success: false
        //     });
        // }

        const tokenData = {
            userId: user._id,
        };
        const jwtSecret = process.env.SECRET_KEY || process.env.JWT_SECRET_KEY || "fallback-secret-key-for-development";
        const token = await jwt.sign(tokenData, jwtSecret, { expiresIn: "1d" });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
            colony: user.colony,
            isVerified: user.isVerified
        };

        return res.status(200)
            .cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "strict" })
            .json({
                message: `Welcome back ${user.fullname}`,
                user,
                token,
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

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully",
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

export const updateProfile = async (req, res) => {
    try {
        console.log('Update profile request:', req.body);
        const { fullname, email, phoneNumber, bio, address, flatNumber, skills } = req.body;
        const userId = req.id;

        let user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false
            });
        }

        console.log('User before update:', user);

        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        
        // Initialize profile if it doesn't exist
        if (!user.profile) {
            user.profile = {};
        }
        
        if (bio !== undefined) user.profile.bio = bio;
        if (address !== undefined) user.profile.address = address;
        if (flatNumber !== undefined) user.profile.flatNumber = flatNumber;
        if (skills !== undefined) {
            console.log('Processing skills:', skills);
            // Convert comma-separated string to array
            user.profile.skills = skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
            console.log('Skills array:', user.profile.skills);
        }



        console.log('User before save:', user);
        await user.save();
        console.log('User saved successfully');

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
            colony: user.colony
        };

        return res.status(200).json({
            message: "Profile updated successfully",
            user,
            success: true
        });
    } catch (error) {
        console.log('Profile update error:', error);
        return res.status(500).json({
            message: error.message || "Server error",
            success: false
        });
    }
};

export const verifyUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByIdAndUpdate(
            userId,
            { isVerified: true },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "User verified successfully",
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