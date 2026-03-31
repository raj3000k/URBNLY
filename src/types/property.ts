import type { CommuteInfo } from "./commute";

export interface Property {
  id: string;
  ownerId?: string;
  title: string;
  location: string;
  price: number;
  image: string;
  images: string[];
  available: boolean;
  verified: boolean;
  distance: string;
  rating: number;
  reviewCount: number;
  capacity: number;
  description: string;
  roomType: string;
  deposit: number;
  foodIncluded: boolean;
  highlights: string[];
  amenities: string[];
  houseRules: string[];
  owner: {
    name: string;
    phone: string;
    responseTime: string;
    role: string;
  };
  socialProof?: {
    residentCount: number;
    interestedCount: number;
    roommateSeekersCount: number;
    capacity: number;
    interestedLabel: string;
    colleaguesCount: number;
    companyName: string;
    colleagueNames: string[];
  };
  commute?: CommuteInfo;
}
