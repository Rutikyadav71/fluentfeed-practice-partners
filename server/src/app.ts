import path from "path";
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";
import { currentUser } from "./middleware/currentUser";
import { sendSuccess } from "./utils/apiResponse";
import apiRoutes from "./routes";

const app: Application = express();
const isProduction = env.NODE_ENV === "production";

app.use(helmet());

// In production the server serves the built client itself (see the static
// block below), so API and frontend share one origin and CORS isn't needed.
// In development the client runs on Vite's dev server (a different origin),
// so CORS has to explicitly allow it.
if (!isProduction) {
  app.use(cors({ origin: env.CLIENT_URL }));
}

app.use(express.json());
app.use(currentUser);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again in a few minutes.",
  },
});
app.use("/api", apiLimiter);

app.get("/api/health", (_req: Request, res: Response) => {
  sendSuccess(res, { status: "ok" }, "FluentFeed API is running");
});

app.use("/api", apiRoutes);

if (isProduction) {
  const clientDistPath = path.join(__dirname, "../../client/dist");
  app.use(express.static(clientDistPath));

  app.get("*", (req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith("/api")) {
      next();
      return;
    }
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

app.use(notFound);
app.use(errorHandler);

export default app;
