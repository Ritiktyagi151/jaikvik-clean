import { Request, Response } from 'express';
import { Job, Application } from '../models/career.model';
import nodemailer from 'nodemailer';

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
    const resumeUrl = req.file ? `/uploads/${req.file.filename}` : '';
    const application = await Application.create({ ...req.body, resumeUrl });

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: 'info@jaikviktechnology.com',
        subject: `New Application: ${req.body.position}`,
        text: `Name: ${req.body.name}\nEmail: ${req.body.email}`
    });

    res.json({ success: true, message: "Submitted" });
};

export const getApps = async (req: Request, res: Response) => {
    const apps = await Application.find().sort({ createdAt: -1 });
    res.json({ success: true, data: apps });
};