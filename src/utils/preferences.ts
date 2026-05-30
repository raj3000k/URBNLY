import type { RoommatePreferences } from "../types/match";

export const preferenceOptions = {
  sleepSchedule: [
    { value: "", label: "Select sleep style" },
    { value: "early_bird", label: "Early bird" },
    { value: "night_owl", label: "Night owl" },
  ],
  cleanliness: [
    { value: "", label: "Select cleanliness level" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ],
  foodPreference: [
    { value: "", label: "Select food preference" },
    { value: "veg", label: "Veg" },
    { value: "eggetarian", label: "Eggetarian" },
    { value: "any", label: "Any" },
  ],
  socialStyle: [
    { value: "", label: "Select social style" },
    { value: "quiet", label: "Quiet" },
    { value: "balanced", label: "Balanced" },
    { value: "social", label: "Social" },
  ],
  workMode: [
    { value: "", label: "Select work mode" },
    { value: "office", label: "Office" },
    { value: "hybrid", label: "Hybrid" },
    { value: "remote", label: "Remote" },
  ],
};

export const emptyPreferences: RoommatePreferences = {
  sleepSchedule: "",
  cleanliness: "",
  foodPreference: "",
  socialStyle: "",
  workMode: "",
  budgetPreference: "",
};
