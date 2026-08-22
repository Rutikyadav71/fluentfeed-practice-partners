import { Types } from "mongoose";
import { Connection, IConnection } from "../models/Connection";
import { User } from "../models/User";
import { AppError } from "../utils/AppError";
import { ConnectionStatus } from "../types/enums";

function assertValidId(id: string, label: string): void {
  if (!Types.ObjectId.isValid(id)) {
    throw AppError.badRequest(`Invalid ${label}.`);
  }
}

export const connectionService = {
  async sendRequest(senderId: string, receiverId: string): Promise<IConnection> {
    assertValidId(senderId, "sender id");
    assertValidId(receiverId, "receiver id");

    if (senderId === receiverId) {
      throw AppError.badRequest("You cannot send a connection request to yourself.");
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      throw AppError.notFound("Receiver not found.");
    }

    const existing = await Connection.findOne({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
      status: { $in: ["pending", "accepted"] },
    });

    if (existing) {
      if (existing.status === "accepted") {
        throw AppError.conflict("You are already connected with this user.");
      }
      throw AppError.conflict("A connection request is already pending with this user.");
    }

    const connection = new Connection({ senderId, receiverId, status: "pending" });
    await connection.save();
    return connection.populate(["senderId", "receiverId"]);
  },

  async listForUser(userId: string) {
    assertValidId(userId, "user id");

    const [incoming, outgoing, connected] = await Promise.all([
      Connection.find({ receiverId: userId, status: "pending" })
        .populate("senderId")
        .populate("receiverId")
        .sort({ createdAt: -1 }),
      Connection.find({ senderId: userId, status: "pending" })
        .populate("senderId")
        .populate("receiverId")
        .sort({ createdAt: -1 }),
      Connection.find({
        status: "accepted",
        $or: [{ senderId: userId }, { receiverId: userId }],
      })
        .populate("senderId")
        .populate("receiverId")
        .sort({ updatedAt: -1 }),
    ]);

    return { incoming, outgoing, connected };
  },

  async updateStatus(
    connectionId: string,
    userId: string,
    status: Extract<ConnectionStatus, "accepted" | "rejected">
  ): Promise<IConnection> {
    assertValidId(connectionId, "connection id");
    assertValidId(userId, "user id");

    const connection = await Connection.findById(connectionId);
    if (!connection) {
      throw AppError.notFound("Connection request not found.");
    }

    if (connection.receiverId.toString() !== userId) {
      throw AppError.badRequest("Only the receiver can respond to this connection request.");
    }

    if (connection.status !== "pending") {
      throw AppError.conflict("This connection request has already been responded to.");
    }

    connection.status = status;
    await connection.save();
    return connection.populate(["senderId", "receiverId"]);
  },
};
