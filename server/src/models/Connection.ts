import { Schema, model, Document, Types } from "mongoose";
import { CONNECTION_STATUSES, ConnectionStatus } from "../types/enums";

export interface IConnection extends Document {
  _id: Types.ObjectId;
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  status: ConnectionStatus;
  pairKey: string;
  createdAt: Date;
  updatedAt: Date;
}

const connectionSchema = new Schema<IConnection>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sender is required"],
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Receiver is required"],
    },
    status: {
      type: String,
      enum: {
        values: CONNECTION_STATUSES as unknown as string[],
        message: "status must be one of: " + CONNECTION_STATUSES.join(", "),
      },
      default: "pending",
    },
    // Normalized, order-independent key for the (sender, receiver) pair, e.g.
    // senderId "A" + receiverId "B" and senderId "B" + receiverId "A" both
    // produce the same pairKey. Combined with the partial unique index below,
    // this closes a race condition: connectionService's findOne-then-insert
    // duplicate check isn't atomic, so two near-simultaneous requests between
    // the same two users could otherwise both pass the check and create two
    // active connection documents. The database itself now rejects the
    // second one.
    pairKey: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

connectionSchema.pre("validate", function (next) {
  if (this.senderId.equals(this.receiverId)) {
    next(new Error("A user cannot send a connection request to themselves."));
    return;
  }
  const ids = [this.senderId.toString(), this.receiverId.toString()].sort();
  this.pairKey = ids.join("_");
  next();
});

connectionSchema.index({ senderId: 1, receiverId: 1 });
connectionSchema.index({ receiverId: 1, status: 1 });
connectionSchema.index({ senderId: 1, status: 1 });

// Defense-in-depth: only one active (pending/accepted) connection allowed
// per pair, enforced at the database level regardless of request timing.
connectionSchema.index(
  { pairKey: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $in: ["pending", "accepted"] } },
  }
);

export const Connection = model<IConnection>("Connection", connectionSchema);
