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

// Practice Mission topics are a static, predefined list rendered entirely
// on the client (client/src/utils/missionTopics.ts) — no backend route is
// needed for Feature 5, per the "keep it simple" requirement.

export default router;
