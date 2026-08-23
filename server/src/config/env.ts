import dotenv from "dotenv";

dotenv.config();

const nodeEnv = process.env.NODE_ENV || "development";

/**
 * Reads a required env var. In production there is NO fallback — a missing
 * MONGODB_URI or CLIENT_URL in prod fails loudly at startup instead of
 * silently connecting to localhost or allowing the wrong origin. In
 * development, devFallback keeps local setup friction-free.
 */
function required(key: string, devFallback?: string): string {
  const value = process.env[key];
  if (value && value.trim().length > 0) return value;

  if (nodeEnv === "production") {
    throw new Error(`Missing required environment variable: ${key} (required in production)`);
  }

  if (devFallback !== undefined) return devFallback;

  throw new Error(`Missing required environment variable: ${key}`);
}

export const env = {
  PORT: Number(process.env.PORT) || 5000,
  MONGODB_URI: required("MONGODB_URI", "mongodb://localhost:27017/fluentfeed"),
  CLIENT_URL: required("CLIENT_URL", "http://localhost:5173"),
  NODE_ENV: nodeEnv,
};
