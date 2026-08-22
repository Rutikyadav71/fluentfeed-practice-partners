import { api } from "./api";
import { User } from "../types/user";
import { ApiSuccess } from "../types/api";

export interface UserFilters {
  englishLevel?: string;
  learningGoal?: string;
  country?: string;
}

export const userService = {
  async list(filters: UserFilters = {}): Promise<User[]> {
    const params = new URLSearchParams();
    if (filters.englishLevel) params.append("englishLevel", filters.englishLevel);
    if (filters.learningGoal) params.append("learningGoal", filters.learningGoal);
    if (filters.country) params.append("country", filters.country);
    const res = await api.get<ApiSuccess<User[]>>(`/users?${params.toString()}`);
    return res.data.data;
  },

  /**
   * Fetches every demo user so the app-wide "Current User" switcher can list
   * them by name. Reuses GET /api/users with no filters.
   */
  async listAll(): Promise<User[]> {
    const res = await api.get<ApiSuccess<User[]>>("/users");
    return res.data.data;
  },
};
