import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import path from "path";
import fs from "fs";
import multer from "multer";

import { connectDB } from "./config/database";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";
import logger from "./utils/logger";

// --- Route Imports ---
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import blogRoutes from "./routes/blog.routes";
import careerRoutes from "./routes/career.routes";
import contactRoutes from "./routes/contact.routes";
import serviceRoutes from "./routes/service.routes";
import videoRoutes from "./routes/video.routes";
import clientRoutes from "./routes/client.routes";
import teamVideoRoutes from "./routes/teamVideo.routes";
import postRoutes from "./routes/post.routes";
import websiteRoutes from "./routes/website.routes";
import bannerRoutes from "./routes/banner.routes";
import heroRoutes from "./routes/heroSection.routes";
import enquiryRoutes from "./routes/enquiry.routes";
import corporateVideoRoutes from "./routes/corporateVideo.routes";
import technologyRoutes from "./routes/technology.routes";
import reviewRoutes from "./routes/review.routes";
import galleryRoutes from "./routes/gallery.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import reelRoutes from "./routes/reel.routes";
import mobileAppRoutes from "./routes/mobileApp.routes";
import teamRoutes from "./routes/team.routes";
import testimonialVideoRoutes from "./routes/testimonialVideo.routes";
import footerRoutes from "./routes/footer.routes";
import navbarRoutes from "./routes/navbar.routes";
import aboutRoutes from "./routes/about.routes";

const app = express();
const PORT = process.env.PORT || 5002;

// ✅ Database Connection
connectDB();

// ✅ Setup Uploads Directory
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("📁 Uploads directory created successfully");
}

// ✅ Security & CORS Middleware
app.use(helmet({
    // crossOriginResourcePolicy: false zaroori hai taki frontend images access kar sake
    crossOriginResourcePolicy: false 
}));

// Aapka manga hua CORS logic
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);

// ✅ Body Parsing
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ✅ Performance & Logging
app.use(compression());
if (process.env.NODE_ENV !== "test") {
    app.use(morgan("dev"));
}

// ✅ Rate Limiting (Production Security)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 2000, 
    message: "Too many requests, please try again later.",
});
app.use("/api/", limiter);

// ✅ Static Folder for Images
app.use("/uploads", express.static(uploadDir));

// ✅ Image Upload Logic (Multer) - Directly integrated like your old code
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "uploads/");
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

app.post("/api/upload", upload.single("file"), (req: any, res: any) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    res.json({
        url: `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`,
    });
});

// ✅ API Routes Registration
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/websites", websiteRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/footer", footerRoutes);
app.use("/api/careers", careerRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/team-videos", teamVideoRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/hero", heroRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/corporate-videos", corporateVideoRoutes);
app.use("/api/technologies", technologyRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reels", reelRoutes);
app.use("/api/mobile-apps", mobileAppRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/testimonial-videos", testimonialVideoRoutes);
app.use("/api/navbar", navbarRoutes);

// ✅ Health Checks
app.get("/", (req, res) => {
    res.json({ success: true, message: "🚀 Jaikvik Technology API is running..." });
});

app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// ✅ Error Handling
app.use(notFound);
app.use(errorHandler);

// ✅ Server Startup
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`🚀 Jaikvik Backend live at http://localhost:${PORT}`);
});

export default app;