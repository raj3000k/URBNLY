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

export interface RoommateInterest {
  id: string;
  status: "pending" | "accepted" | "declined";
  message: string;
  createdAt: string;
  updatedAt: string;
  direction: "sent" | "received";
  property: {
    id: string;
    title: string;
    location: string;
    image: string;
  };
  requester: {
    id: string;
    name: string;
    company: string;
    email: string;
  };
  recipient: {
    id: string;
    name: string;
    company: string;
    email: string;
  };
}
