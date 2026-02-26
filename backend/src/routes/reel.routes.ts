import express from "express";
import * as reelController from "../controllers/reel.controller";

const router = express.Router();

router.get("/", reelController.getAllReels);
router.post("/", reelController.createReel);
router.put("/:id", reelController.updateReel);
router.delete("/:id", reelController.deleteReel);

export default router;