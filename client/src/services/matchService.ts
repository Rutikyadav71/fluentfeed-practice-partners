import { api } from "./api";
import { Match } from "../types/match";
import { ApiSuccess } from "../types/api";

export const matchService = {
  async getMatches(): Promise<Match[]> {
    const res = await api.get<ApiSuccess<Match[]>>("/matches");
    return res.data.data;
  },
};
