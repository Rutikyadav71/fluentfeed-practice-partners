import { api } from "./api";
import { Connection, ConnectionsResponse } from "../types/connection";
import { ApiSuccess } from "../types/api";
import { ConnectionStatus } from "../utils/constants";

export const connectionService = {
  async send(receiverId: string): Promise<Connection> {
    const res = await api.post<ApiSuccess<Connection>>("/connections", { receiverId });
    return res.data.data;
  },
  async list(): Promise<ConnectionsResponse> {
    const res = await api.get<ApiSuccess<ConnectionsResponse>>("/connections");
    return res.data.data;
  },
  async updateStatus(id: string, status: ConnectionStatus): Promise<Connection> {
    const res = await api.put<ApiSuccess<Connection>>(`/connections/${id}`, { status });
    return res.data.data;
  },
};
