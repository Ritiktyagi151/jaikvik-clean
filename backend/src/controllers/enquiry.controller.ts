import { Request, Response } from "express";
import Enquiry from "../models/enquiry.model";

// POST /api/enquiries
export const createEnquiry = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const enquiry = await Enquiry.create({
      fname: req.body.fname,
      email: req.body.email,
      phone: req.body.phone,
      company: req.body.company,
      city: req.body.city,
      message: req.body.message,
      createdBy: (req as any).user?._id || null,
    });
    res.status(201).json(enquiry);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/enquiries (Admin only)
export const getEnquiries = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/enquiries/:id (Admin only)
export const getEnquiryById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      res.status(404).json({ message: "Enquiry not found" });
      return;
    }
    res.json(enquiry);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
