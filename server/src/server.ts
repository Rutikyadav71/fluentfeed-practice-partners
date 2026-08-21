import app from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";

async function start(): Promise<void> {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`FluentFeed server listening on port ${env.PORT}`);
  });
}

start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
