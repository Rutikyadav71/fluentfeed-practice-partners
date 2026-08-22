import { Request, Response, NextFunction } from "express";
import { profileService } from "../services/profileService";
import { sendSuccess } from "../utils/apiResponse";
import { AppError } from "../utils/AppError";

export const profileController = {
    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await profileService.createProfile(req.body);
            sendSuccess(res, user, "Profile created successfully.", 201);
        } catch (err) {
            next(err);
        }
    },

    async get(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.userId) {
                throw AppError.badRequest("x-user-id header is required to fetch a profile.");
            }
            const user = await profileService.getProfile(req.userId);
            sendSuccess(res, user, "Profile fetched successfully.");
        } catch (err) {
            next(err);
        }
    },

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.userId) {
                throw AppError.badRequest("x-user-id header is required to update a profile.");
            }
            const user = await profileService.updateProfile(req.userId, req.body);
            sendSuccess(res, user, "Profile updated successfully.");
        } catch (err) {
            next(err);
        }
    },
};