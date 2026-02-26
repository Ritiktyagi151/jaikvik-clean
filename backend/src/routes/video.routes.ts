import { Router } from "express";
import { getVideos, createVideo, updateVideo, deleteVideo } from "../controllers/video.controller";

const router = Router();

router.get("/", getVideos);
router.post("/", createVideo);
router.put("/:id", updateVideo);
router.delete("/:id", deleteVideo);

export default router;