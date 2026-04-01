import type { Property } from "./property";

export type VisitStatus = "pending" | "confirmed" | "completed" | "cancelled";

export type Visit = {
  id: string;
  scheduledFor: string;
  status: VisitStatus;
  phone: string;
  notes: string;
  createdAt: string;
  property: Property | null;
};

export type OwnerVisit = {
  id: string;
  scheduledFor: string;
  status: VisitStatus;
  phone: string;
  notes: string;
  createdAt: string;
  property: {
    id: string;
    title: string;
    location: string;
    image: string;
  };
  visitor: {
    id: string;
    name: string;
    email: string;
    company?: string;
  };
};
