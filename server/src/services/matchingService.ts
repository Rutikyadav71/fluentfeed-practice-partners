import { IUser } from "../models/User";

export interface MatchResult {
  user: IUser;
  matchScore: number;
  matchReasons: string[];
}

const WEIGHTS = {
  learningGoal: 40,
  englishLevel: 25,
  preferredTime: 20,
  country: 10,
  nativeLanguage: 5,
} as const;

export const matchingService = {
  calculateScore(currentUser: IUser, candidate: IUser): MatchResult {
    let score = 0;
    const reasons: string[] = [];

    if (currentUser.learningGoal === candidate.learningGoal) {
      score += WEIGHTS.learningGoal;
      reasons.push("Same learning goal");
    }
    if (currentUser.englishLevel === candidate.englishLevel) {
      score += WEIGHTS.englishLevel;
      reasons.push("Same English level");
    }
    if (currentUser.preferredTime === candidate.preferredTime) {
      score += WEIGHTS.preferredTime;
      reasons.push("Same practice time");
    }
    if (currentUser.country === candidate.country) {
      score += WEIGHTS.country;
      reasons.push("Same country");
    }
    if (currentUser.nativeLanguage === candidate.nativeLanguage) {
      score += WEIGHTS.nativeLanguage;
      reasons.push("Same native language");
    }

    return { user: candidate, matchScore: score, matchReasons: reasons };
  },

  rankCandidates(currentUser: IUser, candidates: IUser[], limit = 5): MatchResult[] {
    return candidates
      .map((candidate) => this.calculateScore(currentUser, candidate))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);
  },
};
