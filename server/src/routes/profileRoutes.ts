import { Router } from "express";
import { profileController } from "../controllers/profileController";

const router = Router();

router.post("/", profileController.create);
router.get("/", profileController.get);
router.put("/", profileController.update);

export default router;