import { EnglishLevel, LearningGoal, PracticeTime } from "../types/enums";

export interface DemoUserSeed {
  name: string;
  englishLevel: EnglishLevel;
  learningGoal: LearningGoal;
  nativeLanguage: string;
  country: string;
  preferredTime: PracticeTime;
  bio: string;
}

/**
 * 18 seed users with deliberate overlap across englishLevel, learningGoal,
 * country, nativeLanguage, and preferredTime so the matching algorithm
 * (learningGoal=40, englishLevel=25, preferredTime=20, country=10,
 * nativeLanguage=5) produces a realistic, varied spread of scores rather
 * than either all-0% or all-100% matches.
 */
export const DEMO_USERS: DemoUserSeed[] = [
  {
    name: "Rahul Sharma",
    englishLevel: "Intermediate",
    learningGoal: "IELTS",
    nativeLanguage: "Hindi",
    country: "India",
    preferredTime: "Evening",
    bio: "Preparing for IELTS and looking for a speaking practice partner ahead of my exam next month.",
  },
  {
    name: "Priya Nair",
    englishLevel: "Intermediate",
    learningGoal: "IELTS",
    nativeLanguage: "Malayalam",
    country: "India",
    preferredTime: "Evening",
    bio: "Working through IELTS speaking modules. Happy to swap tips on vocabulary and pronunciation.",
  },
  {
    name: "Wei Zhang",
    englishLevel: "Intermediate",
    learningGoal: "IELTS",
    nativeLanguage: "Mandarin",
    country: "China",
    preferredTime: "Night",
    bio: "Studying for IELTS to apply for a master's program abroad. Prefer late evening sessions.",
  },
  {
    name: "Carlos Mendoza",
    englishLevel: "Beginner",
    learningGoal: "Daily Communication",
    nativeLanguage: "Spanish",
    country: "Mexico",
    preferredTime: "Morning",
    bio: "Just starting out with English. Want a patient partner for everyday conversation practice.",
  },
  {
    name: "Fatima Al-Sayed",
    englishLevel: "Beginner",
    learningGoal: "Daily Communication",
    nativeLanguage: "Arabic",
    country: "Egypt",
    preferredTime: "Morning",
    bio: "New to spoken English. Looking to build confidence with simple daily conversations.",
  },
  {
    name: "Yuki Tanaka",
    englishLevel: "Advanced",
    learningGoal: "Business English",
    nativeLanguage: "Japanese",
    country: "Japan",
    preferredTime: "Night",
    bio: "Product manager polishing business English for client calls with overseas partners.",
  },
  {
    name: "Hiro Sato",
    englishLevel: "Advanced",
    learningGoal: "Business English",
    nativeLanguage: "Japanese",
    country: "Japan",
    preferredTime: "Night",
    bio: "Consultant looking to sharpen negotiation and presentation vocabulary for work.",
  },
  {
    name: "Ana Silva",
    englishLevel: "Intermediate",
    learningGoal: "Job Interview",
    nativeLanguage: "Portuguese",
    country: "Brazil",
    preferredTime: "Afternoon",
    bio: "Practicing for upcoming software engineering interviews with international companies.",
  },
  {
    name: "Marco Rossi",
    englishLevel: "Intermediate",
    learningGoal: "Job Interview",
    nativeLanguage: "Italian",
    country: "Italy",
    preferredTime: "Afternoon",
    bio: "Preparing answers for behavioral interview questions. Would love mock interview practice.",
  },
  {
    name: "Amara Okafor",
    englishLevel: "Advanced",
    learningGoal: "TOEFL",
    nativeLanguage: "Igbo",
    country: "Nigeria",
    preferredTime: "Evening",
    bio: "Aiming for a top TOEFL score for graduate school applications this year.",
  },
  {
    name: "Daniel Kim",
    englishLevel: "Advanced",
    learningGoal: "TOEFL",
    nativeLanguage: "Korean",
    country: "South Korea",
    preferredTime: "Evening",
    bio: "Retaking TOEFL to improve my speaking section score. Enjoy discussing tech and travel.",
  },
  {
    name: "Sofia Ivanova",
    englishLevel: "Beginner",
    learningGoal: "IELTS",
    nativeLanguage: "Russian",
    country: "Russia",
    preferredTime: "Night",
    bio: "Starting my IELTS journey from scratch. Looking for a supportive study partner.",
  },
  {
    name: "Liam O'Connor",
    englishLevel: "Intermediate",
    learningGoal: "Daily Communication",
    nativeLanguage: "Irish",
    country: "Ireland",
    preferredTime: "Afternoon",
    bio: "Native-adjacent speaker helping friends practice conversational English casually.",
  },
  {
    name: "Aisha Bello",
    englishLevel: "Intermediate",
    learningGoal: "Business English",
    nativeLanguage: "Hausa",
    country: "Nigeria",
    preferredTime: "Morning",
    bio: "Small business owner improving English for supplier calls and email writing.",
  },
  {
    name: "Nguyen Van An",
    englishLevel: "Beginner",
    learningGoal: "Job Interview",
    nativeLanguage: "Vietnamese",
    country: "Vietnam",
    preferredTime: "Evening",
    bio: "Fresh graduate practicing basic interview phrases for my first tech job applications.",
  },
  {
    name: "Elena Petrova",
    englishLevel: "Advanced",
    learningGoal: "IELTS",
    nativeLanguage: "Bulgarian",
    country: "Bulgaria",
    preferredTime: "Morning",
    bio: "Retaking IELTS for a higher band score, focused on fluency and coherence.",
  },
  {
    name: "Omar Haddad",
    englishLevel: "Intermediate",
    learningGoal: "TOEFL",
    nativeLanguage: "Arabic",
    country: "Jordan",
    preferredTime: "Afternoon",
    bio: "Studying for TOEFL alongside university coursework. Like discussing science topics.",
  },
  {
    name: "Meera Iyer",
    englishLevel: "Advanced",
    learningGoal: "Daily Communication",
    nativeLanguage: "Tamil",
    country: "India",
    preferredTime: "Evening",
    bio: "Fluent speaker who enjoys casual conversation practice with fellow learners in the evenings.",
  },
];
