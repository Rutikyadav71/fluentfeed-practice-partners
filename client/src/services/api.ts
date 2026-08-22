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

    // The request was sent but no response came back at all — the API
    // server is most likely not running or unreachable, which is a
    // different situation from a 4xx/5xx response with no message body.
    if (error.request && !error.response) {
      return "Unable to reach the server. Make sure the backend is running and try again.";
    }
  }
  return "Something went wrong. Please try again.";
}
