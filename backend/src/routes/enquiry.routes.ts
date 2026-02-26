import express from "express";
import { protect, admin } from "../middleware/auth";
import {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
} from "../controllers/enquiry.controller";

const router = express.Router();

// Public
router.post("/", createEnquiry);

// Admin
router.get("/", protect, admin, getEnquiries);
router.get("/:id", protect, admin, getEnquiryById);

export default router;
