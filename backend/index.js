import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js"
import colonyRoute from "./routes/colony.route.js"
import serviceRoute from "./routes/service.route.js"

const app = express();
dotenv.config({});

//middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:3000',
            'https://mycolony.onrender.com',
            /\.netlify\.app$/,  // Allow all Netlify domains
            /\.vercel\.app$/    // Allow all Vercel domains
        ];
        
        const isAllowed = allowedOrigins.some(allowedOrigin => {
            if (typeof allowedOrigin === 'string') {
                return origin === allowedOrigin;
            }
            return allowedOrigin.test(origin);
        });
        
        if (isAllowed) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;

app.use("/api/v1/user", userRoute);
app.use("/api/v1/colony", colonyRoute);
app.use("/api/v1/service", serviceRoute);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running at ${PORT}`);
});