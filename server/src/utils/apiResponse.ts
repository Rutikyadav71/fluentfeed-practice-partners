import { Response } from "express";

interface SuccessPayload<T> {
  success: true;
  data: T;
  message: string;
}

interface ErrorPayload {
  success: false;
  message: string;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200
): Response<SuccessPayload<T>> {
  return res.status(statusCode).json({ success: true, data, message });
}

export function sendError(
  res: Response,
  message = "Something went wrong",
  statusCode = 500
): Response<ErrorPayload> {
  return res.status(statusCode).json({ success: false, message });
}
