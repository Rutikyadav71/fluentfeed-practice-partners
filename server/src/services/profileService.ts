import { Types } from "mongoose";
import { User, IUser } from "../models/User";
import { AppError } from "../utils/AppError";
import { EnglishLevel, LearningGoal, PracticeTime } from "../types/enums";

export interface ProfileInput {
    name: string;
    englishLevel: EnglishLevel;
    learningGoal: LearningGoal;
    nativeLanguage: string;
    country: string;
    preferredTime: PracticeTime;
    bio: string;
}

export type ProfileUpdateInput = Partial<ProfileInput>;

function assertValidId(userId: string): void {
    if (!Types.ObjectId.isValid(userId)) {
        throw AppError.badRequest("Invalid user id.");
    }
}

export const profileService = {
    async createProfile(input: ProfileInput): Promise<IUser> {
        const user = new User(input);
        await user.save();
        return user;
    },

    async getProfile(userId: string): Promise<IUser> {
        assertValidId(userId);
        const user = await User.findById(userId);
        if (!user) {
            throw AppError.notFound("Profile not found.");
        }
        return user;
    },

    async updateProfile(userId: string, input: ProfileUpdateInput): Promise<IUser> {
        assertValidId(userId);
        const user = await User.findByIdAndUpdate(userId, input, {
            new: true,
            runValidators: true,
            context: "query",
        });
        if (!user) {
            throw AppError.notFound("Profile not found.");
        }
        return user;
    },
};