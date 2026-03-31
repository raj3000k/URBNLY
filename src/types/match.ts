export interface RoommatePreferences {
  sleepSchedule: string;
  cleanliness: string;
  foodPreference: string;
  socialStyle: string;
  workMode: string;
  budgetPreference: string;
}

export interface RoommateMatch {
  userId: string;
  name: string;
  email: string;
  company: string;
  currentPropertyId: string;
  score: number;
  label: string;
  reasons: string[];
  preferences: RoommatePreferences;
}
