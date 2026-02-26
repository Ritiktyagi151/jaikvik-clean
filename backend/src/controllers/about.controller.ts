import { Request, Response } from "express";
import { About } from "../models/about.model";

// GET Data
export const getAboutContent = async (req: Request, res: Response) => {
  try {
    const content = await About.findOne();
    res.status(200).json(content || {}); 
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST/UPDATE Data (Handling Frontend's axios.post)
export const updateAboutContent = async (req: Request, res: Response) => {
  try {
    const content = await About.findOneAndUpdate(
      {}, 
      req.body, 
      { 
        new: true, 
        upsert: true, 
        runValidators: false 
      }
    );

    res.status(200).json({
      success: true,
      message: "Data saved successfully",
      data: content
    });
  } catch (error: any) {
    console.error("Save Error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};