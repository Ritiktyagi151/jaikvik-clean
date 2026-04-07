import { Request, Response } from "express";
import { Review } from "../models/review.model";
import logger from "../utils/logger";

export const getReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const reviews = await Review.find({ status: "active" }).sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    logger.error("Get reviews error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      res.status(404).json({ success: false, message: "Review not found" });
      return;
    }
    res.json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      author,
      fname,
      email,
      company,
      cname,
      text,
      msg,
      stars,
      rating,
    } = req.body;

    const resolvedAuthor = author || fname;
    const resolvedText = text || msg;
    const resolvedStars = Number(stars ?? rating);
    const resolvedCompany = company || cname;

    if (!resolvedAuthor || !resolvedText || !resolvedStars) {
      res
        .status(400)
        .json({ success: false, message: "Author, text, and stars are required" });
      return;
    }

    const review = await Review.create({
      author: resolvedAuthor,
      email,
      company: resolvedCompany,
      text: resolvedText,
      stars: resolvedStars,
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    logger.error("Create review error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      res.status(404).json({ success: false, message: "Review not found" });
      return;
    }
    await review.deleteOne();
    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    logger.error("Delete review error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
