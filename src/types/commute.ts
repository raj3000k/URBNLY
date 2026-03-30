export interface CommuteInfo {
  officeLocation: string;
  distanceText: string;
  durationText: string;
  source: "google" | "fallback";
  status?: string;
}
