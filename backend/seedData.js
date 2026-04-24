import mongoose from "mongoose";
import { Colony } from "./models/colony.model.js";
import { User } from "./models/user.model.js";
import { Service } from "./models/service.model.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const seedData = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // Clear existing data
        await Colony.deleteMany({});
        await User.deleteMany({});
        await Service.deleteMany({});

        // Create sample colonies
        const colonies = await Colony.create([
            {
                name: "Green Valley Residency",
                description: "A premium residential colony with modern amenities and excellent connectivity.",
                address: "Sector 45, Gurgaon",
                city: "Gurgaon",
                pincode: "122003",
                totalFlats: 120,
                amenities: ["Swimming Pool", "Gym", "Garden", "Security", "Parking"],
                adminId: new mongoose.Types.ObjectId()
            },
            {
                name: "Sunrise Apartments",
                description: "Affordable housing with all basic amenities in a peaceful environment.",
                address: "Sector 62, Noida",
                city: "Noida", 
                pincode: "201301",
                totalFlats: 80,
                amenities: ["Parking", "Security", "Garden"],
                adminId: new mongoose.Types.ObjectId()
            },
            {
                name: "Royal Heights",
                description: "Luxury living with world-class facilities and prime location.",
                address: "Bandra West, Mumbai",
                city: "Mumbai",
                pincode: "400050",
                totalFlats: 200,
                amenities: ["Swimming Pool", "Gym", "Club House", "Security", "Parking"],
                adminId: new mongoose.Types.ObjectId()
            }
        ]);

        // Create sample admin user
        const hashedPassword = await bcrypt.hash("admin123", 10);
        const adminUser = await User.create({
            fullname: "Admin User",
            email: "admin@mycolony.com",
            phoneNumber: "9876543210",
            password: hashedPassword,
            role: "admin",
            colony: colonies[0]._id,
            isVerified: true,
            profile: {
                address: "Admin Office",
                flatNumber: "ADM-001"
            }
        });

        // Update colony admin
        colonies[0].adminId = adminUser._id;
        await colonies[0].save();

        // Create sample resident users
        const residents = await User.create([
            {
                fullname: "Priya Sharma",
                email: "priya@example.com",
                phoneNumber: "9876543211",
                password: await bcrypt.hash("password123", 10),
                role: "resident",
                colony: colonies[0]._id,
                isVerified: true,
                profile: {
                    address: "Green Valley Residency",
                    flatNumber: "A-204"
                }
            },
            {
                fullname: "Rajesh Kumar",
                email: "rajesh@example.com",
                phoneNumber: "9876543212",
                password: await bcrypt.hash("password123", 10),
                role: "resident",
                colony: colonies[0]._id,
                isVerified: true,
                profile: {
                    address: "Green Valley Residency",
                    flatNumber: "B-105"
                }
            }
        ]);

        // Create sample services
        await Service.create([
            {
                title: "Home Cooked Tiffin Service",
                description: "Fresh, healthy home-cooked meals delivered daily. Customizable menu options available.",
                category: "Food & Tiffin",
                price: "₹150/day",
                availability: "Mon-Sat, 12PM-2PM",
                menu: [
                    { item: "Dal Rice with Sabzi", price: "₹120" },
                    { item: "Roti with Curry", price: "₹100" },
                    { item: "Special Thali", price: "₹180" }
                ],
                serviceProvider: residents[0]._id,
                colony: colonies[0]._id,
                isActive: true,
                isApproved: true,
                rating: 4.5
            },
            {
                title: "Express Laundry Service",
                description: "Quick and reliable laundry service with pickup and delivery.",
                category: "Laundry",
                price: "₹50/kg",
                availability: "Daily, 9AM-6PM",
                serviceProvider: residents[1]._id,
                colony: colonies[0]._id,
                isActive: true,
                isApproved: true,
                rating: 4.2
            }
        ]);

        console.log("Sample data created successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
};

seedData();