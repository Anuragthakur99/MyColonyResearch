import { Service } from "../models/service.model.js";
import { Colony } from "../models/colony.model.js";
import { User } from "../models/user.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const createService = async (req, res) => {
    try {
        console.log('Create service request:', req.body);
        console.log('User ID from token:', req.id);
        
        const { title, description, category, price, availability, colony } = req.body;
        let menu = [];
        if (req.body.menu) {
            try { menu = JSON.parse(req.body.menu); } catch { menu = []; }
        }
        const userId = req.id;

        if (!title || !description || !category || !price || !colony) {
            return res.status(400).json({
                message: "Title, description, category, price, and colony are required",
                success: false
            });
        }

        // Get user's colony
        const user = await User.findById(userId);
        console.log('Found user:', user);
        
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        // If user doesn't have colony, assign default colony
        let colonyId = user.colony;
        if (!colonyId) {
            let defaultColony = await Colony.findOne({ name: "Default Colony" });
            if (!defaultColony) {
                defaultColony = await Colony.create({
                    name: "Default Colony",
                    description: "Default residential colony",
                    address: "Default Address",
                    city: "Default City", 
                    pincode: "000000"
                });
            }
            colonyId = defaultColony._id;
            // Update user with colony
            await User.findByIdAndUpdate(userId, { colony: colonyId });
        }

        let images = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const fileUri = getDataUri(file);
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
                images.push(cloudResponse.secure_url);
            }
        }

        const service = await Service.create({
            title,
            description,
            category,
            price,
            availability: availability || 'Not specified',
            menu: menu || [],
            serviceProvider: userId,
            colony: colony,
            images
        });

        console.log('Service created:', service);

        return res.status(201).json({
            message: "Service created successfully. Waiting for admin approval.",
            service,
            success: true
        });
    } catch (error) {
        console.log('Service creation error:', error);
        return res.status(500).json({
            message: error.message || "Server error",
            success: false
        });
    }
};

export const getAllServices = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const category = req.query.category || "";
        const colonyId = req.query.colony || "";

        const query = {
            isApproved: true,
            isActive: true
        };

        // Only add keyword search if keyword exists
        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ];
        }

        if (category) {
            query.category = category;
        }

        if (colonyId) {
            query.colony = colonyId;
        }

        console.log('Service query:', query);
        const services = await Service.find(query)
            .populate('serviceProvider', 'fullname phoneNumber profile')
            .populate('colony', 'name address')
            .sort({ createdAt: -1 });

        console.log('Found services:', services.length);
        console.log('Services data:', services.map(s => ({ id: s._id, title: s.title, colony: s.colony?._id, approved: s.isApproved, active: s.isActive })));
        return res.status(200).json({
            services,
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

export const getServiceById = async (req, res) => {
    try {
        const serviceId = req.params.id;
        const service = await Service.findById(serviceId)
            .populate('serviceProvider', 'fullname phoneNumber profile')
            .populate('colony', 'name address')
            .populate('reviews.user', 'fullname');

        if (!service) {
            return res.status(404).json({
                message: "Service not found",
                success: false
            });
        }

        return res.status(200).json({
            service,
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

export const approveService = async (req, res) => {
    try {
        const serviceId = req.params.id;
        const service = await Service.findByIdAndUpdate(
            serviceId,
            { isApproved: true, isActive: true },
            { new: true }
        );

        if (!service) {
            return res.status(404).json({
                message: "Service not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Service approved successfully",
            service,
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

export const getMyServices = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId);
        
        // Check if colony exists
        let colony = await Colony.findById(user.colony);
        console.log('Colony exists:', !!colony, colony?.name);
        
        // If colony doesn't exist, assign to first available colony
        if (!colony) {
            colony = await Colony.findOne();
            if (colony) {
                console.log('Assigning to existing colony:', colony.name);
                await User.findByIdAndUpdate(userId, { colony: colony._id });
                await Service.updateMany(
                    { serviceProvider: userId },
                    { colony: colony._id }
                );
            }
        }
        
        const services = await Service.find({ serviceProvider: userId })
            .sort({ createdAt: -1 });

        console.log('Raw services after fix:', services.map(s => ({ 
            title: s.title, 
            colonyId: s.colony 
        })));
        
        const populatedServices = await Service.find({ serviceProvider: userId })
            .populate('colony', 'name')
            .sort({ createdAt: -1 });

        console.log('User services with colony info:', populatedServices.map(s => ({ 
            title: s.title, 
            colonyId: s.colony?._id, 
            colonyName: s.colony?.name 
        })));

        return res.status(200).json({
            services: populatedServices,
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

export const getPendingServices = async (req, res) => {
    try {
        const services = await Service.find({ isApproved: false })
            .populate('serviceProvider', 'fullname profile')
            .populate('colony', 'name')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            services,
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

export const deleteService = async (req, res) => {
    try {
        const serviceId = req.params.id;
        const service = await Service.findByIdAndDelete(serviceId);

        if (!service) {
            return res.status(404).json({
                message: "Service not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Service deleted successfully",
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

export const updateService = async (req, res) => {
    try {
        const serviceId = req.params.id;
        const userId = req.id;
        const { title, description, category, price, availability, colony } = req.body;

        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({
                message: "Service not found",
                success: false
            });
        }

        // Check if user owns this service
        if (service.serviceProvider.toString() !== userId) {
            return res.status(403).json({
                message: "Not authorized to update this service",
                success: false
            });
        }

        let images = service.images || [];
        if (req.files && req.files.length > 0) {
            images = [];
            for (const file of req.files) {
                const fileUri = getDataUri(file);
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
                images.push(cloudResponse.secure_url);
            }
        }

        const updatedService = await Service.findByIdAndUpdate(
            serviceId,
            {
                title,
                description,
                category,
                price,
                availability: availability || 'Not specified',
                colony,
                images,
                isApproved: false // Reset approval status when edited
            },
            { new: true }
        );

        return res.status(200).json({
            message: "Service updated successfully. Pending admin approval.",
            service: updatedService,
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