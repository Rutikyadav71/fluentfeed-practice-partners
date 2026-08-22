import axios from "axios";
import { CURRENT_USER_STORAGE_KEY } from "../utils/constants";

export const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const userId = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
  if (userId) {
    config.headers["x-user-id"] = userId;
  }
  return config;
});

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string") return message;
  }
  return "Something went wrong. Please try again.";
}
