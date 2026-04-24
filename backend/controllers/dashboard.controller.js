import { Colony } from "../models/colony.model.js";
import { User } from "../models/user.model.js";
import { Service } from "../models/service.model.js";

export const getDashboardStats = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found", success: false });

        const isAdmin = user.role === "admin";
        const colonyFilter = isAdmin ? {} : { _id: user.colony };
        const colonies = await Colony.find(colonyFilter).lean();
        const colonyIds = colonies.map(c => c._id);

        // ── Users ──────────────────────────────────────────────────────────
        const allUsers = await User.find({ colony: { $in: colonyIds } }).lean();
        const verifiedUsers = allUsers.filter(u => u.isVerified).length;
        const residentCount = allUsers.filter(u => u.role === "resident").length;
        const adminCount = allUsers.filter(u => u.role === "admin").length;
        const verificationRate = allUsers.length
            ? Math.round((verifiedUsers / allUsers.length) * 100) : 0;

        // Recent registrations (last 7 days)
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const recentUsers = allUsers.filter(u => new Date(u.createdAt) >= sevenDaysAgo).length;

        // Users per colony
        const usersPerColony = colonies.map(c => ({
            name: c.name,
            residents: allUsers.filter(u => u.colony?.toString() === c._id.toString() && u.role === "resident").length,
            admins: allUsers.filter(u => u.colony?.toString() === c._id.toString() && u.role === "admin").length,
            verified: allUsers.filter(u => u.colony?.toString() === c._id.toString() && u.isVerified).length,
            totalFlats: c.totalFlats || 0,
        }));

        // ── Services ──────────────────────────────────────────────────────
        const allServices = await Service.find({ colony: { $in: colonyIds } }).lean();
        const approvedServices = allServices.filter(s => s.isApproved && s.isActive);
        const pendingServices = allServices.filter(s => !s.isApproved);
        const recentServices = allServices.filter(s => new Date(s.createdAt) >= sevenDaysAgo).length;

        // Approval rate (trust metric)
        const approvalRate = allServices.length
            ? Math.round((approvedServices.length / allServices.length) * 100) : 0;

        // Category distribution
        const categoryMap = {};
        allServices.forEach(s => {
            categoryMap[s.category] = (categoryMap[s.category] || 0) + 1;
        });
        const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

        // Avg rating
        const ratedServices = approvedServices.filter(s => s.rating > 0);
        const avgRating = ratedServices.length
            ? parseFloat((ratedServices.reduce((sum, s) => sum + s.rating, 0) / ratedServices.length).toFixed(1)) : 0;

        // Rating distribution
        const ratingDist = [1, 2, 3, 4, 5].map(r => ({
            rating: `${r}★`,
            count: approvedServices.filter(s => Math.round(s.rating) === r).length,
        }));

        // Total reviews
        const totalReviews = approvedServices.reduce((sum, s) => sum + (s.reviews?.length || 0), 0);

        // Services per colony
        const servicesPerColony = colonies.map(c => ({
            name: c.name,
            approved: allServices.filter(s => s.colony?.toString() === c._id.toString() && s.isApproved).length,
            pending: allServices.filter(s => s.colony?.toString() === c._id.toString() && !s.isApproved).length,
            amenities: c.amenities?.length || 0,
        }));

        // Avg price by category
        const priceByCategory = {};
        allServices.forEach(s => {
            const price = parseFloat(s.price?.toString().replace(/[^0-9.]/g, "")) || 0;
            if (price > 0) {
                if (!priceByCategory[s.category]) priceByCategory[s.category] = { total: 0, count: 0 };
                priceByCategory[s.category].total += price;
                priceByCategory[s.category].count += 1;
            }
        });
        const avgPriceData = Object.entries(priceByCategory).map(([cat, val]) => ({
            category: cat.split(" ")[0],
            full: cat,
            avg: Math.round(val.total / val.count),
        }));

        // Price segments
        const prices = allServices
            .map(s => parseFloat(s.price?.toString().replace(/[^0-9.]/g, "")) || 0)
            .filter(p => p > 0);
        const priceSegments = {
            budget: prices.filter(p => p < 200).length,
            mid: prices.filter(p => p >= 200 && p < 500).length,
            premium: prices.filter(p => p >= 500).length,
        };

        // ── Monthly trend (real data from createdAt) ───────────────────────
        const now = new Date();
        const monthlyTrend = Array.from({ length: 6 }, (_, i) => {
            const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
            const next = new Date(now.getFullYear(), now.getMonth() - (5 - i) + 1, 1);
            const monthServices = allServices.filter(s => {
                const created = new Date(s.createdAt);
                return created >= d && created < next;
            });
            const monthUsers = allUsers.filter(u => {
                const created = new Date(u.createdAt);
                return created >= d && created < next;
            });
            const monthApproved = monthServices.filter(s => s.isApproved).length;
            const monthRated = monthServices.filter(s => s.rating > 0);
            const monthAvgRating = monthRated.length
                ? parseFloat((monthRated.reduce((sum, s) => sum + s.rating, 0) / monthRated.length).toFixed(1)) : 0;
            return {
                month: d.toLocaleString("default", { month: "short" }),
                services: monthServices.length,
                users: monthUsers.length,
                approved: monthApproved,
                rating: monthAvgRating,
            };
        });

        // ── Top rated services ─────────────────────────────────────────────
        const topServices = [...approvedServices]
            .filter(s => s.rating > 0)
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 5)
            .map(s => ({
                _id: s._id,
                title: s.title,
                category: s.category,
                rating: s.rating,
                reviewCount: s.reviews?.length || 0,
                price: s.price,
            }));

        // ── Missing categories ─────────────────────────────────────────────
        const allCats = ["Food & Tiffin", "Laundry", "Cleaning", "Grocery", "Maintenance", "Tutoring", "Pet Care"];
        const existingCats = new Set(allServices.map(s => s.category));
        const missingCategories = allCats.filter(c => !existingCats.has(c));

        // ── Trust Score (research-aligned: verification + approval + ratings) ──
        // Formula: (verificationRate * 0.4) + (approvalRate * 0.3) + (avgRating/5 * 100 * 0.3)
        const trustScore = Math.round(
            (verificationRate * 0.4) +
            (approvalRate * 0.3) +
            ((avgRating / 5) * 100 * 0.3)
        );

        // ── Provider diversity (unique providers per category) ─────────────
        const providersByCategory = {};
        allServices.forEach(s => {
            if (!providersByCategory[s.category]) providersByCategory[s.category] = new Set();
            providersByCategory[s.category].add(s.serviceProvider?.toString());
        });
        const providerDiversity = Object.entries(providersByCategory).map(([cat, set]) => ({
            category: cat,
            providers: set.size,
        }));

        // ── Community engagement score per colony ──────────────────────────
        // engagement = (services offered / residents) * 100, capped at 100
        const colonyEngagement = colonies.map(c => {
            const colResidents = allUsers.filter(u => u.colony?.toString() === c._id.toString() && u.role === "resident").length;
            const colServices = allServices.filter(s => s.colony?.toString() === c._id.toString()).length;
            const engagement = colResidents > 0 ? Math.min(100, Math.round((colServices / colResidents) * 100)) : 0;
            const colVerified = allUsers.filter(u => u.colony?.toString() === c._id.toString() && u.isVerified).length;
            const colTotal = allUsers.filter(u => u.colony?.toString() === c._id.toString()).length;
            const colVerRate = colTotal > 0 ? Math.round((colVerified / colTotal) * 100) : 0;
            const colApproved = allServices.filter(s => s.colony?.toString() === c._id.toString() && s.isApproved).length;
            const colAllSvc = allServices.filter(s => s.colony?.toString() === c._id.toString()).length;
            const colApprRate = colAllSvc > 0 ? Math.round((colApproved / colAllSvc) * 100) : 0;
            return {
                name: c.name,
                engagement,
                verificationRate: colVerRate,
                approvalRate: colApprRate,
                amenities: c.amenities?.length || 0,
                totalFlats: c.totalFlats || 0,
                residents: colResidents,
                services: colAllSvc,
            };
        });

        // ── Review activity (reviews per month) ───────────────────────────
        const reviewActivity = Array.from({ length: 6 }, (_, i) => {
            const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
            const next = new Date(now.getFullYear(), now.getMonth() - (5 - i) + 1, 1);
            let reviewCount = 0;
            approvedServices.forEach(s => {
                (s.reviews || []).forEach(r => {
                    const created = new Date(r.createdAt);
                    if (created >= d && created < next) reviewCount++;
                });
            });
            return {
                month: d.toLocaleString("default", { month: "short" }),
                reviews: reviewCount,
            };
        });

        return res.status(200).json({
            success: true,
            stats: {
                // Summary KPIs
                totalColonies: colonies.length,
                totalUsers: allUsers.length,
                totalResidents: residentCount,
                totalAdmins: adminCount,
                verifiedUsers,
                verificationRate,
                recentUsers,
                totalServices: allServices.length,
                approvedServices: approvedServices.length,
                pendingServices: pendingServices.length,
                recentServices,
                approvalRate,
                avgRating,
                totalReviews,
                trustScore,
                // Charts
                categoryData,
                ratingDist,
                avgPriceData,
                priceSegments,
                monthlyTrend,
                usersPerColony,
                servicesPerColony,
                topServices,
                missingCategories,
                providerDiversity,
                colonyEngagement,
                reviewActivity,
                // Meta
                isAdmin,
                colonyName: !isAdmin && colonies[0] ? colonies[0].name : null,
            }
        });
    } catch (error) {
        console.log("Dashboard stats error:", error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

export const rejectService = async (req, res) => {
    try {
        const serviceId = req.params.id;
        const service = await Service.findByIdAndDelete(serviceId);
        if (!service) return res.status(404).json({ message: "Service not found", success: false });
        return res.status(200).json({ message: "Service rejected and removed", success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};
