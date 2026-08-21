import dotenv from "dotenv";

dotenv.config();

function required(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  PORT: Number(process.env.PORT) || 5000,
  MONGODB_URI: required("MONGODB_URI", "mongodb://localhost:27017/fluentfeed"),
  CLIENT_URL: required("CLIENT_URL", "http://localhost:5173"),
  NODE_ENV: process.env.NODE_ENV || "development",
};
