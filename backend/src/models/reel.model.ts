import mongoose, { Schema, Document } from "mongoose";

export interface IReel extends Document {
  video: string;
  poster: string;
  title?: string;
}

const ReelSchema: Schema = new Schema(
  {
    video: { type: String, required: true }, // URL string
    poster: { type: String, required: true }, // Poster URL string
    title: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IReel>("Reel", ReelSchema);