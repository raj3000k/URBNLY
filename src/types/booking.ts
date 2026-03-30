import type { Property } from "./property";

export interface Booking {
  id: string;
  userId: string;
  propertyId: string;
  amount: number;
  currency: string;
  status: "created" | "confirmed";
  provider: "demo" | "razorpay";
  paymentOrderId: string | null;
  paymentId: string | null;
  createdAt: string;
  property?: Property | null;
}
