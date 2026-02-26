import { Schema, model, Document } from "mongoose";

export interface IEnquiry extends Document {
  fname: string;
  email: string;
  phone: string;
  company: string;
  city: string;
  message: string;
  createdBy?: string; // userId (optional)
  createdAt: Date;
  updatedAt: Date;
}

const enquirySchema = new Schema<IEnquiry>(
  {
    fname: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    company: { type: String, required: true },
    city: { type: String, required: true },
    message: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Enquiry = model<IEnquiry>("Enquiry", enquirySchema);
export default Enquiry;
