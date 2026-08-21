export const ENGLISH_LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;
export type EnglishLevel = (typeof ENGLISH_LEVELS)[number];

export const LEARNING_GOALS = [
  "IELTS",
  "TOEFL",
  "Job Interview",
  "Daily Communication",
  "Business English",
] as const;
export type LearningGoal = (typeof LEARNING_GOALS)[number];

export const PRACTICE_TIMES = ["Morning", "Afternoon", "Evening", "Night"] as const;
export type PracticeTime = (typeof PRACTICE_TIMES)[number];

export const CONNECTION_STATUSES = ["pending", "accepted", "rejected"] as const;
export type ConnectionStatus = (typeof CONNECTION_STATUSES)[number];
