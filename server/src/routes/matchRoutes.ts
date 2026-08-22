import { Router } from "express";
import { matchController } from "../controllers/matchController";

const router = Router();

router.get("/", matchController.getMatches);

export default router;
