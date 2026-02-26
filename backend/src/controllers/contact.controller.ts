import { Request, Response } from "express";
import { Contact } from "../models/contact.model";
import logger from "../utils/logger";

// Submit new contact
export const submitContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const contactData = {
      ...req.body,
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
    };

    const contact = await Contact.create(contactData);

    res.status(201).json({
      success: true,
      message: "Contact form submitted successfully",
      data: contact,
    });
  } catch (error) {
    logger.error("Submit contact error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all contacts (Admin only)
export const getContacts = async (req: Request, res: Response): Promise<void> => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: contacts });
  } catch (error) {
    logger.error("Get contacts error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get single contact
export const getContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      res.status(404).json({ success: false, message: "Not found" });
      return; // ✅ Added return to fix TS7030
    }
    res.json({ success: true, data: contact });
  } catch (error) {
    logger.error("Get contact error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update contact
export const updateContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!contact) {
      res.status(404).json({ success: false, message: "Not found" });
      return; // ✅ Added return to fix TS7030
    }
    res.json({ success: true, data: contact });
  } catch (error) {
    logger.error("Update contact error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete contact
export const deleteContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      res.status(404).json({ success: false, message: "Not found" });
      return; // ✅ Added return to fix TS7030
    }
    await contact.deleteOne();
    res.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    logger.error("Delete contact error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};