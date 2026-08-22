import { Router } from "express";
import { connectionController } from "../controllers/connectionController";

const router = Router();

router.post("/", connectionController.send);
router.get("/", connectionController.list);
router.put("/:id", connectionController.updateStatus);

export default router;
