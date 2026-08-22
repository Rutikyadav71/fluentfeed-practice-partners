import { api } from "./api";
import { User, ProfileInput, ProfileUpdateInput } from "../types/user";
import { ApiSuccess } from "../types/api";

export const profileService = {
  async create(input: ProfileInput): Promise<User> {
    const res = await api.post<ApiSuccess<User>>("/profile", input);
    return res.data.data;
  },
  async get(): Promise<User> {
    const res = await api.get<ApiSuccess<User>>("/profile");
    return res.data.data;
  },
  async update(input: ProfileUpdateInput): Promise<User> {
    const res = await api.put<ApiSuccess<User>>("/profile", input);
    return res.data.data;
  },
};
