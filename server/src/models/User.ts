import { Schema, model, Document, Types } from "mongoose";
import {
  ENGLISH_LEVELS,
  LEARNING_GOALS,
  PRACTICE_TIMES,
  EnglishLevel,
  LearningGoal,
  PracticeTime,
} from "../types/enums";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  englishLevel: EnglishLevel;
  learningGoal: LearningGoal;
  nativeLanguage: string;
  country: string;
  preferredTime: PracticeTime;
  bio: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [80, "Name must be under 80 characters"],
    },
    englishLevel: {
      type: String,
      required: [true, "English level is required"],
      enum: {
        values: ENGLISH_LEVELS as unknown as string[],
        message: "englishLevel must be one of: " + ENGLISH_LEVELS.join(", "),
      },
    },
    learningGoal: {
      type: String,
      required: [true, "Learning goal is required"],
      enum: {
        values: LEARNING_GOALS as unknown as string[],
        message: "learningGoal must be one of: " + LEARNING_GOALS.join(", "),
      },
    },
    nativeLanguage: {
      type: String,
      required: [true, "Native language is required"],
      trim: true,
      minlength: [2, "Native language must be at least 2 characters"],
      maxlength: [50, "Native language must be under 50 characters"],
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
      minlength: [2, "Country must be at least 2 characters"],
      maxlength: [60, "Country must be under 60 characters"],
    },
    preferredTime: {
      type: String,
      required: [true, "Preferred practice time is required"],
      enum: {
        values: PRACTICE_TIMES as unknown as string[],
        message: "preferredTime must be one of: " + PRACTICE_TIMES.join(", "),
      },
    },
    bio: {
      type: String,
      required: [true, "Bio is required"],
      trim: true,
      minlength: [10, "Bio must be at least 10 characters"],
      maxlength: [300, "Bio must be under 300 characters"],
    },
  },
  { timestamps: true }
);

userSchema.index({ englishLevel: 1 });
userSchema.index({ learningGoal: 1 });
userSchema.index({ country: 1 });

export const User = model<IUser>("User", userSchema);
