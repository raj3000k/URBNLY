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
}
