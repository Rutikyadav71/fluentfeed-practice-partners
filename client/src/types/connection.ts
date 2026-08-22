import { ConnectionStatus } from "../utils/constants";
import { User } from "./user";

export interface Connection {
  _id: string;
  senderId: User;
  receiverId: User;
  status: ConnectionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ConnectionsResponse {
  incoming: Connection[];
  outgoing: Connection[];
  connected: Connection[];
}
