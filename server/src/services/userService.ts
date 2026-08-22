import { FilterQuery } from "mongoose";
import { User, IUser } from "../models/User";

export interface UserFilters {
  englishLevel?: string;
  learningGoal?: string;
  country?: string;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const userService = {
  async listUsers(filters: UserFilters): Promise<IUser[]> {
    const query: FilterQuery<IUser> = {};

    if (filters.englishLevel) query.englishLevel = filters.englishLevel;
    if (filters.learningGoal) query.learningGoal = filters.learningGoal;
    if (filters.country) query.country = new RegExp(`^${escapeRegex(filters.country)}$`, "i");

    return User.find(query).sort({ createdAt: -1 });
  },
};
