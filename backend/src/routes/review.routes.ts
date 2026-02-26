import express from "express";
import {
  getReviews,
  getReview,
  createReview,
  deleteReview,
} from "../controllers/review.controller";
import { protect, admin } from "../middleware/auth";

const router = express.Router();

// Public
router.get("/", getReviews);
router.get("/:id", getReview);
router.post("/", createReview); // anyone can submit review

// Admin
router.delete("/:id", protect, admin, deleteReview);

export default router;
