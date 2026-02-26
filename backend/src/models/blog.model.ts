import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string;
  author: string;
  image: string;
  status: "draft" | "published" | "archived";
  views: number;
  locked: boolean;
  createdAt: Date;
}

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true, maxlength: 500 },
    content: { type: String, required: true },
    category: { type: String, required: true },
    author: { type: String, default: "Admin" },
    image: { type: String, required: true },
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
    views: { type: Number, default: 0 },
    locked: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }, 
  },
  { 
    timestamps: { createdAt: false, updatedAt: true } 
  }
);

// Slug generator logic
blogSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") 
      .replace(/[\s_-]+/g, "-") 
      .replace(/^-+|-+$/g, ""); 
  }
  next();
});

export const Blog = mongoose.model<IBlog>("Blog", blogSchema);