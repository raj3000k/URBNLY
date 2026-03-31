import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BedDouble,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Heart,
  MapPin,
  ShieldCheck,
  Sparkles,
  Utensils,
  Users2,
} from "lucide-react";
import axios from "axios";
import api from "../utils/api";
import type { Property } from "../types/property";
import type { Booking } from "../types/booking";
import type { CommuteInfo } from "../types/commute";
import type { RoommateMatch } from "../types/match";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

function DetailSkeleton() {
  return (
    <div className="min-h-screen animate-pulse bg-mintMist p-4">
      <div className="mx-auto max-w-6xl space-y-4">
        <div className="h-80 rounded-[32px] bg-white/70" />
        <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-4 rounded-[32px] bg-white/80 p-6">
            <div className="h-8 w-2/3 rounded-full bg-emeraldDark/10" />
            <div className="h-4 w-1/3 rounded-full bg-emeraldDark/10" />
            <div className="h-24 rounded-3xl bg-emeraldDark/10" />
          </div>
          <div className="rounded-[32px] bg-white/80 p-6">
            <div className="h-40 rounded-3xl bg-emeraldDark/10" />
          </div>
        </div>
      </div>
    </div>
  );
}

const loadRazorpayScript = () =>
  new Promise<boolean>((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function PropertyDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const initialProperty = location.state as Property | undefined;
  const [property, setProperty] = useState<Property | null>(initialProperty || null);
  const [loading, setLoading] = useState(!initialProperty);
  const [error, setError] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [latestBooking, setLatestBooking] = useState<Booking | null>(null);
  const [commuteInfo, setCommuteInfo] = useState<CommuteInfo | null>(
    initialProperty?.commute || null
  );
  const [matches, setMatches] = useState<RoommateMatch[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [commuteLoading, setCommuteLoading] = useState(false);
  const { toggleWishlist, isSaved } = useWishlist();
  const { user } = useAuth();

  useEffect(() => {
    setActiveImageIndex(0);
  }, [property?.id]);

  useEffect(() => {
    setCommuteInfo(initialProperty?.commute || null);
  }, [initialProperty?.commute, initialProperty?.id]);

  useEffect(() => {
    if (initialProperty || !id) {
      return;
    }

    let ignore = false;

    const fetchProperty = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get(`/properties/${id}`);

        if (!ignore) {
          setProperty(response.data as Property);
        }
      } catch (err) {
        if (!ignore) {
          if (axios.isAxiosError(err)) {
            setError(err.response?.data?.message || "Unable to load property");
          } else {
            setError("Unable to load property");
          }
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchProperty();

    return () => {
      ignore = true;
    };
  }, [id, initialProperty]);

  useEffect(() => {
    if (!property) {
      return;
    }

    const storedOffice = localStorage.getItem("selectedOffice");

    if (!storedOffice) {
      return;
    }

    const parsedOffice = JSON.parse(storedOffice) as {
      label: string;
      location: {
        latitude: number;
        longitude: number;
      };
    };

    const controller = new AbortController();

    const fetchCommute = async () => {
      setCommuteLoading(true);

      try {
        const response = await api.post(
          "/commute",
          {
            officeLocation: parsedOffice.label,
            officeCoordinates: parsedOffice.location,
            propertyIds: [property.id],
          },
          {
            signal: controller.signal,
          }
        );

        const commute = response.data.data?.[0];

        if (commute) {
          setCommuteInfo({
            officeLocation: commute.officeLocation,
            distanceText: commute.distanceText,
            durationText: commute.durationText,
            source: commute.source,
            status: commute.status,
          });
        }
      } catch {
        setCommuteInfo(null);
      } finally {
        setCommuteLoading(false);
      }
    };

    fetchCommute();

    return () => controller.abort();
  }, [property]);

  useEffect(() => {
    if (!property || !user) {
      setMatches([]);
      return;
    }

    const controller = new AbortController();

    const fetchMatches = async () => {
      setMatchesLoading(true);

      try {
        const response = await api.get(`/matches/${property.id}`, {
          signal: controller.signal,
        });
        setMatches(response.data.data || []);
      } catch {
        setMatches([]);
      } finally {
        setMatchesLoading(false);
      }
    };

    fetchMatches();

    return () => controller.abort();
  }, [property?.id, user]);

  const gallery = useMemo(() => {
    if (!property) {
      return [];
    }

    if (property.images?.length) {
      return property.images;
    }

    return [property.image];
  }, [property]);

  const confirmBooking = async (payload: {
    bookingId: string;
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
  }) => {
    const response = await api.post("/bookings/confirm", payload);
    setLatestBooking(response.data.booking as Booking);
    setBookingMessage("Token booking confirmed. The owner can now follow up with you.");
    setBookingError("");
  };

  const handleBooking = async () => {
    if (!property) {
      return;
    }

    if (!user) {
      navigate("/login", { state: { from: `/property/${property.id}` } });
      return;
    }

    setBookingLoading(true);
    setBookingError("");
    setBookingMessage("");

    try {
      const response = await api.post("/bookings/create-order", {
        propertyId: property.id,
      });

      const { provider, booking, order, keyId, message } = response.data as {
        provider: "demo" | "razorpay";
        booking: Booking;
        order: { id: string; amount: number; currency: string };
        keyId?: string;
        message?: string;
      };

      if (provider === "demo") {
        await confirmBooking({
          bookingId: booking.id,
          razorpay_order_id: order.id,
          razorpay_payment_id: `demo_payment_${booking.id}`,
        });
        setBookingMessage(
          message ||
            "Demo booking completed. Add Razorpay test keys to switch this to real checkout."
        );
        return;
      }

      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded || !window.Razorpay) {
        setBookingError("Unable to load Razorpay checkout. Please try again.");
        return;
      }

      const razorpay = new window.Razorpay({
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Urbanly",
        description: `Token booking for ${property.title}`,
        order_id: order.id,
        handler: async (paymentResponse: Record<string, string>) => {
          await confirmBooking({
            bookingId: booking.id,
            razorpay_order_id: paymentResponse.razorpay_order_id,
            razorpay_payment_id: paymentResponse.razorpay_payment_id,
            razorpay_signature: paymentResponse.razorpay_signature,
          });
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#0F5C4A",
        },
      });

      razorpay.open();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setBookingError(err.response?.data?.message || "Unable to start booking flow");
      } else {
        setBookingError("Unable to start booking flow");
      }
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <DetailSkeleton />;
  }

  if (!property) {
    return (
      <div className="min-h-screen px-4 py-10">
        <div className="mx-auto max-w-xl rounded-[28px] border border-red-200 bg-white p-8 text-center shadow-sm">
          <h1 className="font-display text-2xl text-emeraldDark">
            Property unavailable
          </h1>
          <p className="mt-3 text-sm text-fog">{error || "No property data found."}</p>
          <button
            onClick={() => navigate("/home")}
            className="mt-6 rounded-2xl bg-emeraldDark px-5 py-3 font-semibold text-white transition hover:bg-emeraldAccent"
          >
            Back to listings
          </button>
        </div>
      </div>
    );
  }

  const saved = isSaved(property.id);
  const activeImage = gallery[activeImageIndex] || property.image;

  return (
    <div className="min-h-screen bg-gradient-to-br from-mintMist via-white to-sandstone/60 pb-28">
      <div className="mx-auto max-w-6xl px-4 py-5">
        <div className="relative overflow-hidden rounded-[34px] border border-white/70 bg-white/80 shadow-float backdrop-blur">
          <img
            src={activeImage}
            alt={property.title}
            className="h-[320px] w-full object-cover sm:h-[420px]"
          />

          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
            <button
              onClick={() => navigate(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-emeraldDark shadow"
            >
              <ArrowLeft size={18} />
            </button>

            {user && (
              <button
                onClick={async () => {
                  try {
                    await toggleWishlist(property);
                  } catch (err) {
                    if (err instanceof Error) {
                      alert(err.message);
                    }
                  }
                }}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-emeraldDark shadow"
                aria-label={saved ? "Remove from saved" : "Save property"}
              >
                <Heart
                  size={18}
                  className={saved ? "fill-red-500 text-red-500" : "text-emeraldDark"}
                />
              </button>
            )}
          </div>

          {gallery.length > 1 && (
            <>
              <button
                onClick={() =>
                  setActiveImageIndex((current) =>
                    current === 0 ? gallery.length - 1 : current - 1
                  )
                }
                className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() =>
                  setActiveImageIndex((current) =>
                    current === gallery.length - 1 ? 0 : current + 1
                  )
                }
                className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>

        {gallery.length > 1 && (
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {gallery.map((image, index) => (
              <button
                key={`${property.id}-${index}`}
                onClick={() => setActiveImageIndex(index)}
                className={`overflow-hidden rounded-[22px] border transition ${
                  activeImageIndex === index
                    ? "border-emeraldAccent shadow-lg shadow-emeraldAccent/20"
                    : "border-transparent opacity-80"
                }`}
              >
                <img
                  src={image}
                  alt={`${property.title} ${index + 1}`}
                  className="h-24 w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <section className="space-y-6">
            <div className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-float backdrop-blur">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    {property.available && (
                      <span className="rounded-full bg-emeraldSoft px-3 py-1 text-xs font-semibold text-emeraldDark">
                        Available now
                      </span>
                    )}
                    {property.verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emeraldDark px-3 py-1 text-xs font-semibold text-white">
                        <ShieldCheck size={12} />
                        Verified stay
                      </span>
                    )}
                  </div>

                  <h1 className="mt-4 font-display text-3xl text-emeraldDark sm:text-4xl">
                    {property.title}
                  </h1>
                  <div className="mt-3 flex items-center gap-2 text-sm text-fog">
                    <MapPin size={15} />
                    <span>{property.location}</span>
                    <span className="text-emeraldAccent">•</span>
                    <span>
                      {commuteInfo
                        ? `${commuteInfo.durationText} drive • ${commuteInfo.distanceText}`
                        : `${property.distance} from office`}
                    </span>
                  </div>
                </div>

                <div className="rounded-[28px] bg-mintMist p-4 text-right">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fog">
                    Starting from
                  </p>
                  <p className="mt-2 text-3xl font-bold text-emeraldDark">
                    ₹{property.price}
                  </p>
                  <p className="mt-1 text-sm text-fog">per month</p>
                </div>
              </div>

              <p className="mt-6 text-sm leading-7 text-fog">{property.description}</p>

              {property.socialProof && property.socialProof.colleaguesCount > 0 && (
                <div className="mt-6 flex items-start gap-3 rounded-[24px] border border-emeraldAccent/20 bg-emeraldAccent/10 p-4 text-sm text-emeraldDark">
                  <Users2 size={18} className="mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold">
                      {property.socialProof.colleaguesCount} people from{" "}
                      {property.socialProof.companyName} already stay here
                    </p>
                    {property.socialProof.colleagueNames.length > 0 && (
                      <p className="mt-1 text-emeraldDark/80">
                        Colleagues nearby:{" "}
                        {property.socialProof.colleagueNames.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {property.socialProof &&
                property.socialProof.colleaguesCount === 0 &&
                property.socialProof.residentCount > 0 && (
                  <div className="mt-6 rounded-[24px] border border-emeraldDark/10 bg-mintMist p-4 text-sm text-inkSlate">
                    {property.socialProof.residentCount} Urbanly users have already
                    shortlisted this stay.
                  </div>
                )}

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl bg-sandstone/65 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fog">
                    Room type
                  </p>
                  <p className="mt-2 text-lg font-semibold text-inkSlate">
                    {property.roomType}
                  </p>
                </div>
                <div className="rounded-3xl bg-sandstone/65 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fog">
                    Security deposit
                  </p>
                  <p className="mt-2 text-lg font-semibold text-inkSlate">
                    ₹{property.deposit}
                  </p>
                </div>
                <div className="rounded-3xl bg-sandstone/65 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fog">
                    Food plan
                  </p>
                  <p className="mt-2 text-lg font-semibold text-inkSlate">
                    {property.foodIncluded ? "Included" : "Optional"}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-[30px] border border-white/70 bg-white/90 p-6 shadow-float backdrop-blur">
                <div className="flex items-center gap-2 text-emeraldDark">
                  <Sparkles size={18} />
                  <h2 className="font-display text-2xl">Highlights</h2>
                </div>
                <div className="mt-5 space-y-3">
                  {property.highlights.map((highlight) => (
                    <div
                      key={highlight}
                      className="rounded-2xl bg-mintMist px-4 py-3 text-sm font-medium text-inkSlate"
                    >
                      {highlight}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[30px] border border-white/70 bg-white/90 p-6 shadow-float backdrop-blur">
                <div className="flex items-center gap-2 text-emeraldDark">
                  <BedDouble size={18} />
                  <h2 className="font-display text-2xl">Amenities</h2>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {property.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="rounded-2xl border border-emeraldDark/8 bg-sandstone/55 px-4 py-3 text-sm font-medium text-inkSlate"
                    >
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/70 bg-white/90 p-6 shadow-float backdrop-blur">
              <div className="flex items-center gap-2 text-emeraldDark">
                <Utensils size={18} />
                <h2 className="font-display text-2xl">House rules</h2>
              </div>
              <div className="mt-5 space-y-3">
                {property.houseRules.map((rule) => (
                  <div
                    key={rule}
                    className="rounded-2xl border border-dashed border-emeraldDark/15 px-4 py-3 text-sm text-fog"
                  >
                    {rule}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-white/70 bg-white/90 p-6 shadow-float backdrop-blur">
              <div className="flex items-center gap-2 text-emeraldDark">
                <Users2 size={18} />
                <h2 className="font-display text-2xl">Roommate matches</h2>
              </div>

              <p className="mt-3 text-sm leading-6 text-fog">
                Based on who is targeting this PG and how closely their lifestyle
                preferences align with yours.
              </p>

              {matchesLoading ? (
                <p className="mt-5 text-sm text-fog">Checking compatible roommates...</p>
              ) : matches.length === 0 ? (
                <div className="mt-5 rounded-[24px] border border-dashed border-emeraldDark/15 px-4 py-4 text-sm text-fog">
                  No strong roommate signals yet for this property. Update your
                  profile preferences and target PG to improve matching.
                </div>
              ) : (
                <div className="mt-5 space-y-4">
                  {matches.map((match) => (
                    <div
                      key={match.userId}
                      className="rounded-[24px] border border-emeraldDark/10 bg-mintMist/60 p-4"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-lg font-semibold text-inkSlate">{match.name}</p>
                          <p className="mt-1 text-sm text-fog">
                            {match.company || "Urbanly member"}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-emeraldDark px-3 py-2 text-right text-white">
                          <p className="text-xs uppercase tracking-[0.18em] text-emeraldSoft">
                            Match score
                          </p>
                          <p className="mt-1 text-2xl font-bold">{match.score}%</p>
                          <p className="text-xs text-emeraldSoft">{match.label}</p>
                        </div>
                      </div>

                      {match.reasons.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {match.reasons.map((reason) => (
                            <span
                              key={`${match.userId}-${reason}`}
                              className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-emeraldDark shadow-sm"
                            >
                              {reason}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[30px] border border-emeraldDark/10 bg-emeraldDark p-6 text-white shadow-float">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emeraldSoft">
                Owner info
              </p>
              <h2 className="mt-3 font-display text-2xl">{property.owner.name}</h2>
              <p className="mt-1 text-sm text-emeraldSoft">{property.owner.role}</p>
              <div className="mt-6 space-y-3 text-sm text-emeraldSoft">
                <p>{property.owner.phone}</p>
                <p>{property.owner.responseTime}</p>
              </div>
              <button className="mt-6 w-full rounded-2xl bg-white px-4 py-3 font-semibold text-emeraldDark transition hover:bg-sandstone">
                Contact owner
              </button>
            </div>

            <div className="rounded-[30px] border border-white/70 bg-white/90 p-6 shadow-float backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fog">
                    Token booking
                  </p>
                  <h2 className="mt-2 font-display text-2xl text-emeraldDark">
                    Reserve with ₹999
                  </h2>
                </div>
                <div className="rounded-2xl bg-emeraldSoft px-3 py-2 text-xs font-semibold text-emeraldDark">
                  Test mode
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-fog">
                Pay a small booking token to show serious intent and get the owner to
                hold the room for follow-up.
              </p>

              <div className="mt-5 space-y-3 text-sm text-fog">
                <div className="flex items-center justify-between rounded-2xl bg-mintMist px-4 py-3">
                  <span>Token amount</span>
                  <span className="font-semibold text-emeraldDark">₹999</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-mintMist px-4 py-3">
                  <span>Availability</span>
                  <span className="font-semibold text-emeraldDark">
                    {property.available ? "Open" : "Waitlist"}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-mintMist px-4 py-3">
                  <span>Commute</span>
                  <span className="font-semibold text-emeraldDark">
                    {commuteInfo
                      ? `${commuteInfo.durationText} • ${commuteInfo.distanceText}`
                      : property.distance}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-mintMist px-4 py-3">
                  <span>Rating</span>
                  <span className="font-semibold text-emeraldDark">
                    {property.rating.toFixed(1)} / 5
                  </span>
                </div>
              </div>

              {commuteLoading && (
                <p className="mt-4 text-xs text-fog">Refreshing commute estimate...</p>
              )}

              {bookingError && (
                <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {bookingError}
                </p>
              )}

              {bookingMessage && (
                <p className="mt-4 rounded-2xl border border-emeraldAccent/20 bg-emeraldSoft px-4 py-3 text-sm text-emeraldDark">
                  {bookingMessage}
                </p>
              )}

              {latestBooking && (
                <div className="mt-4 rounded-2xl border border-emeraldDark/10 px-4 py-3 text-sm text-fog">
                  Latest booking: <span className="font-semibold text-emeraldDark">{latestBooking.status}</span>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-emeraldDark/10 bg-white/90 p-4 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row">
          <button className="flex-1 rounded-2xl border border-emeraldDark/10 px-5 py-3 font-semibold text-emeraldDark transition hover:bg-mintMist">
            Schedule a visit
          </button>
          <button
            onClick={handleBooking}
            disabled={bookingLoading || !property.available}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emeraldDark px-5 py-3 font-semibold text-white transition hover:bg-emeraldAccent disabled:cursor-not-allowed disabled:opacity-60"
          >
            <CreditCard size={18} />
            {bookingLoading ? "Starting booking..." : "Pay ₹999 token"}
          </button>
        </div>
      </div>
    </div>
  );
}
