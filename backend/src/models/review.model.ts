import mongoose, { Document, Schema } from "mongoose";

export interface IReview extends Document {
  author: string;
  text: string;
  stars: number;
  status: "active" | "inactive" | "draft";
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    author: {
      type: String,
      required: [true, "Please add your name"],
      trim: true,
    },
    text: {
      type: String,
      required: [true, "Please add review text"],
      maxlength: [500, "Review cannot be more than 500 characters"],
    },
    stars: {
      type: Number,
      required: [true, "Please add a star rating"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot be more than 5"],
    },
    status: {
      type: String,
      enum: ["active", "inactive", "draft"],
      default: "active",
    },
  },
  { timestamps: true }
);

// ✅ Named Export: Dashboard mein import { Review } use karein
export const Review = mongoose.model<IReview>("Review", reviewSchema);