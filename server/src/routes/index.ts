import { Router } from "express";
import profileRoutes from "./profileRoutes";
import userRoutes from "./userRoutes";
import matchRoutes from "./matchRoutes";
import connectionRoutes from "./connectionRoutes";

const router = Router();

router.use("/profile", profileRoutes);
router.use("/users", userRoutes);
router.use("/matches", matchRoutes);
router.use("/connections", connectionRoutes);

// missionRoutes will be mounted in Phase 12.

export default router;
