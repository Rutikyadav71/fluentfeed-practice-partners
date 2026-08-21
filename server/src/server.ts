import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: { status: "ok" },
    message: "FluentFeed API is running",
  });
});

app.listen(PORT, () => {
  console.log(`FluentFeed server listening on port ${PORT}`);
});
