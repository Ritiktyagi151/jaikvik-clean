import express from "express";
import {
  submitContact,
  getContacts,
  getContact,
  updateContact,
  deleteContact,
} from "../controllers/contact.controller";
import { protect, admin } from "../middleware/auth";

const router = express.Router();

// Public
router.post("/", submitContact);

// Admin protected
router.get("/", protect, admin, getContacts);
router.get("/:id", protect, admin, getContact);
router.put("/:id", protect, admin, updateContact);
router.delete("/:id", protect, admin, deleteContact);

export default router;
