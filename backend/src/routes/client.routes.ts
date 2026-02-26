import express from "express";
import { 
  getClients, 
  createClient, 
  updateClient, 
  deleteClient 
} from "../controllers/client.controller";
import upload from "../middleware/mutler"; // Ab ye module mil jayega

const router = express.Router();

router.get("/", getClients); // Callback Error yahan se solve hogi
router.post("/", upload.single("logo"), createClient);
router.put("/:id", upload.single("logo"), updateClient);
router.delete("/:id", deleteClient);

export default router;