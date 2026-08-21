import { Schema, model, Document, Types } from "mongoose";
import { CONNECTION_STATUSES, ConnectionStatus } from "../types/enums";

export interface IConnection extends Document {
  _id: Types.ObjectId;
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  status: ConnectionStatus;
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
  },
  { timestamps: true }
);

connectionSchema.pre("validate", function (next) {
  if (this.senderId.equals(this.receiverId)) {
    next(new Error("A user cannot send a connection request to themselves."));
  } else {
    next();
  }
});

connectionSchema.index({ senderId: 1, receiverId: 1 });
connectionSchema.index({ receiverId: 1, status: 1 });
connectionSchema.index({ senderId: 1, status: 1 });

export const Connection = model<IConnection>("Connection", connectionSchema);
