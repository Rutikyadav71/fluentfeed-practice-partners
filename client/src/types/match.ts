import { User } from "./user";

export interface Match extends User {
  matchScore: number;
  matchReasons: string[];
}
