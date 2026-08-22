import { Request, Response, NextFunction } from "express";
import { userService } from "../services/userService";
import { sendSuccess } from "../utils/apiResponse";

export const userController = {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { englishLevel, learningGoal, country } = req.query;
      const users = await userService.listUsers({
        englishLevel: typeof englishLevel === "string" ? englishLevel : undefined,
        learningGoal: typeof learningGoal === "string" ? learningGoal : undefined,
        country: typeof country === "string" ? country : undefined,
      });
      sendSuccess(res, users, "Users fetched successfully.");
    } catch (err) {
      next(err);
    }
  },
};
