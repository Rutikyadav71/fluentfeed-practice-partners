import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import { matchingService } from "../services/matchingService";
import { sendSuccess } from "../utils/apiResponse";
import { AppError } from "../utils/AppError";

export const matchController = {
  async getMatches(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        throw AppError.badRequest("x-user-id header is required to find matches.");
      }

      const currentUser = await User.findById(req.userId);
      if (!currentUser) {
        throw AppError.notFound("Current user profile not found.");
      }

      const candidates = await User.find({ _id: { $ne: currentUser._id } });
      const ranked = matchingService.rankCandidates(currentUser, candidates, 5);

      const payload = ranked.map(({ user, matchScore, matchReasons }) => ({
        _id: user._id,
        name: user.name,
        englishLevel: user.englishLevel,
        learningGoal: user.learningGoal,
        nativeLanguage: user.nativeLanguage,
        country: user.country,
        preferredTime: user.preferredTime,
        bio: user.bio,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        matchScore,
        matchReasons,
      }));

      sendSuccess(res, payload, "Matches fetched successfully.");
    } catch (err) {
      next(err);
    }
  },
};
