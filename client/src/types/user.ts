import { EnglishLevel, LearningGoal, PracticeTime } from "../utils/constants";

export interface User {
  _id: string;
  name: string;
  englishLevel: EnglishLevel;
  learningGoal: LearningGoal;
  nativeLanguage: string;
  country: string;
  preferredTime: PracticeTime;
  bio: string;
  createdAt: string;
  updatedAt: string;
}

export type ProfileInput = Omit<User, "_id" | "createdAt" | "updatedAt">;
export type ProfileUpdateInput = Partial<ProfileInput>;
