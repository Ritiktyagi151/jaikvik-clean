import express from "express";
import * as controller from "../controllers/testimonialVideo.controller";

const router = express.Router();

router.get("/", controller.getAllTestimonials);
router.post("/", controller.createTestimonial);
router.put("/:id", controller.updateTestimonial);
router.delete("/:id", controller.deleteTestimonial);

export default router;