import { Router } from "express";
import profileRoutes from "./profileRoutes";

const router = Router();

router.use("/profile", profileRoutes);

// userRoutes, matchRoutes, connectionRoutes, missionRoutes
// will be mounted here in later phases.

export default router;