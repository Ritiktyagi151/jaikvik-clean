import { Request, Response } from "express";
import { Blog } from "../models/blog.model";

// ADMIN: Get All Blogs (Drafts + Published)
export const getAllBlogsAdmin = async (req: Request, res: Response): Promise<any> => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    return res.json({ success: true, data: blogs });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Admin fetch error" });
  }
};

// PUBLIC: Get Published Only
export const getBlogs = async (req: Request, res: Response): Promise<any> => {
  try {
    const blogs = await Blog.find({ status: "published" }).sort({ createdAt: -1 });
    return res.json({ success: true, data: blogs });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Public fetch error" });
  }
};

// GET BY SLUG
export const getBlogBySlug = async (req: Request, res: Response): Promise<any> => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug: slug });
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    
    blog.views += 1;
    await blog.save();
    return res.json({ success: true, data: blog });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Slug fetch error" });
  }
};

// CREATE
export const createBlog = async (req: Request, res: Response): Promise<any> => {
  try {
    const blogData = { ...req.body };
    if (req.file) {
      blogData.image = `/uploads/${req.file.filename}`;
    }
    if (blogData.createdAt) {
      blogData.createdAt = new Date(blogData.createdAt);
    }
    const blog = await Blog.create(blogData);
    return res.status(201).json({ success: true, data: blog });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// UPDATE
export const updateBlog = async (req: Request, res: Response): Promise<any> => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }
    if (updateData.createdAt) {
      updateData.createdAt = new Date(updateData.createdAt);
    }
    const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found to update" });
    }
    return res.json({ success: true, data: blog });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Update error" });
  }
};

// DELETE
export const deleteBlog = async (req: Request, res: Response): Promise<any> => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found to delete" });
    }
    return res.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Delete error" });
  }
};

// TOGGLE LOCK
export const toggleLock = async (req: Request, res: Response): Promise<any> => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    blog.locked = !blog.locked;
    await blog.save();
    return res.json({ success: true, data: blog });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Lock error" });
  }
};