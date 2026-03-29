import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BedDouble,
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  ShieldCheck,
  Sparkles,
  Utensils,
} from "lucide-react";
import axios from "axios";
import api from "../utils/api";
import type { Property } from "../types/property";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

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

export default function PropertyDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const initialProperty = location.state as Property | undefined;
  const [property, setProperty] = useState<Property | null>(initialProperty || null);
  const [loading, setLoading] = useState(!initialProperty);
  const [error, setError] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { toggleWishlist, isSaved } = useWishlist();
  const { user } = useAuth();

  useEffect(() => {
    setActiveImageIndex(0);
  }, [property?.id]);

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

  const gallery = useMemo(() => {
    if (!property) {
      return [];
    }

    if (property.images?.length) {
      return property.images;
    }

    return [property.image];
  }, [property]);

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
            onClick={() => navigate("/")}
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
                    <span>{property.distance} from office</span>
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
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fog">
                Quick summary
              </p>
              <div className="mt-5 space-y-3 text-sm text-fog">
                <div className="flex items-center justify-between rounded-2xl bg-mintMist px-4 py-3">
                  <span>Availability</span>
                  <span className="font-semibold text-emeraldDark">
                    {property.available ? "Open" : "Waitlist"}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-mintMist px-4 py-3">
                  <span>Verification</span>
                  <span className="font-semibold text-emeraldDark">
                    {property.verified ? "Verified" : "Pending"}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-mintMist px-4 py-3">
                  <span>Commute</span>
                  <span className="font-semibold text-emeraldDark">
                    {property.distance}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-emeraldDark/10 bg-white/90 p-4 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row">
          <button className="flex-1 rounded-2xl border border-emeraldDark/10 px-5 py-3 font-semibold text-emeraldDark transition hover:bg-mintMist">
            Schedule a visit
          </button>
          <button className="flex-1 rounded-2xl bg-emeraldDark px-5 py-3 font-semibold text-white transition hover:bg-emeraldAccent">
            Book this property
          </button>
        </div>
      </div>
    </div>
  );
}
