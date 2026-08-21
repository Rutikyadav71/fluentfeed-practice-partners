import express, { Application, Request, Response } from "express";
import cors from "cors";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";
import { sendSuccess } from "./utils/apiResponse";

const app: Application = express();

app.use(cors({ origin: env.CLIENT_URL }));
app.use(express.json());

app.get("/api/health", (_req: Request, res: Response) => {
  sendSuccess(res, { status: "ok" }, "FluentFeed API is running");
});

// Feature routes will be mounted here starting Phase 4 (profileRoutes, etc.)

app.use(notFound);
app.use(errorHandler);

export default app;
