import { Request, Response } from "express";
import Footer from "../models/footer.model";

// READ: Data fetch karne ke liye
export const getFooter = async (req: Request, res: Response) => {
  try {
    const footer = await Footer.findOne();
    // Agar DB khali hai toh default empty object bhejien taaki frontend crash na ho
    return res.status(200).json(footer || {
      description: "",
      socials: {},
      contacts: { offices: [], email: "", phones: [] },
      copyright: ""
    });
  } catch (err) {
    return res.status(500).json({ message: "Error fetching footer data" });
  }
};

// UPDATE/CREATE: Full CRUD Support
export const saveFooter = async (req: Request, res: Response) => {
  try {
    let footer = await Footer.findOne();
    
    // Frontend se poora object tempData ke roop mein aayega
    const updateData = {
      description: req.body.description,
      socials: req.body.socials,
      contacts: req.body.contacts, // Dynamic Offices aur Phones isme honge
      copyright: req.body.copyright
    };

    if (!footer) {
      footer = new Footer(updateData);
    } else {
      // Existing data ko update karein
      footer.set(updateData);
    }

    const savedFooter = await footer.save();
    return res.status(200).json({ 
      success: true, 
      message: "Footer updated successfully", 
      data: savedFooter 
    });
  } catch (err: any) {
    return res.status(400).json({ 
      success: false, 
      message: "Save failed", 
      error: err.message 
    });
  }
};