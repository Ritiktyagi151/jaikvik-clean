import { Request, Response } from "express";
import { Job, Application } from "../models/career.model";
import nodemailer from "nodemailer";

export const getJobs = async (req: Request, res: Response) => {
  const jobs = await Job.find().sort({ createdAt: -1 });
  res.json({ success: true, data: jobs });
};

export const createJob = async (req: Request, res: Response) => {
  const job = await Job.create(req.body);
  res.json({ success: true, data: job });
};

export const deleteJob = async (req: Request, res: Response) => {
  await Job.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Deleted" });
};

export const submitApp = async (req: Request, res: Response) => {
  try {
    const resumeUrl = req.file ? `/uploads/${req.file.filename}` : "";

    if (!req.body?.name || !req.body?.email || !req.body?.phone || !req.body?.position) {
      res.status(400).json({ success: false, message: "Missing required application fields" });
      return;
    }

    if (!resumeUrl) {
      res.status(400).json({ success: false, message: "Resume upload is required" });
      return;
    }

    await Application.create({ ...req.body, resumeUrl });

    const canSendEmail = process.env.EMAIL_USER && process.env.EMAIL_PASS;
    if (canSendEmail) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: "info@jaikvik.com",
          subject: `New Application: ${req.body.position}`,
          text: `Name: ${req.body.name}\nEmail: ${req.body.email}\nPhone: ${req.body.phone}`,
        });
      } catch (mailError) {
        console.error("Career application email failed:", mailError);
      }
    }

    res.json({ success: true, message: "Submitted" });
  } catch (error) {
    console.error("Career application submission failed:", error);
    res.status(500).json({ success: false, message: "Failed to submit application" });
  }
};

export const getApps = async (req: Request, res: Response) => {
  const apps = await Application.find().sort({ createdAt: -1 });
  res.json({ success: true, data: apps });
};
