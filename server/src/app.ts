import express, { Application, Request, Response } from "express";
import cors from "cors";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";
import { currentUser } from "./middleware/currentUser";
import { sendSuccess } from "./utils/apiResponse";
import apiRoutes from "./routes";

const app: Application = express();

app.use(cors({ origin: env.CLIENT_URL }));
app.use(express.json());
app.use(currentUser);

app.get("/api/health", (_req: Request, res: Response) => {
  sendSuccess(res, { status: "ok" }, "FluentFeed API is running");
});

app.use("/api", apiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;