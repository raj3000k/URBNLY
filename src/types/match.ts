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
  firstName: string;
  company: string;
  currentPropertyId: string;
  lookingForRoommate: boolean;
  score: number;
  label: string;
  reasons: string[];
  preferences: RoommatePreferences;
}
