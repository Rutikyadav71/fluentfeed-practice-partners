import { Request, Response, NextFunction } from "express";
import { connectionService } from "../services/connectionService";
import { sendSuccess } from "../utils/apiResponse";
import { AppError } from "../utils/AppError";

export const connectionController = {
  async send(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        throw AppError.badRequest("x-user-id header is required to send a connection request.");
      }
      const { receiverId } = req.body;
      if (!receiverId) {
        throw AppError.badRequest("receiverId is required.");
      }
      const connection = await connectionService.sendRequest(req.userId, receiverId);
      sendSuccess(res, connection, "Connection request sent successfully.", 201);
    } catch (err) {
      next(err);
    }
  },

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        throw AppError.badRequest("x-user-id header is required to view connections.");
      }
      const result = await connectionService.listForUser(req.userId);
      sendSuccess(res, result, "Connections fetched successfully.");
    } catch (err) {
      next(err);
    }
  },

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        throw AppError.badRequest("x-user-id header is required to update a connection.");
      }
      const { status } = req.body;
      if (status !== "accepted" && status !== "rejected") {
        throw AppError.badRequest("status must be one of: accepted, rejected");
      }
      const connection = await connectionService.updateStatus(req.params.id, req.userId, status);
      const message = status === "accepted" ? "Connection accepted." : "Connection rejected.";
      sendSuccess(res, connection, message);
    } catch (err) {
      next(err);
    }
  },
};
