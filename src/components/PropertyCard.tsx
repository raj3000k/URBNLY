import type { Property } from "../types/property";
import { MapPin, CheckCircle, Heart, Star, Users2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

type Props = {
  property: Property;
};

export default function PropertyCard({ property }: Props) {
  const navigate = useNavigate();
  const { toggleWishlist, isSaved } = useWishlist();
  const { user } = useAuth();
  const saved = isSaved(property.id);

  return (
    <div
      onClick={() => navigate(`/property/${property.id}`, { state: property })}
      className="surface-lift cursor-pointer overflow-hidden rounded-[28px] border border-white/70 bg-white/95 shadow-float backdrop-blur"
    >
      {/* Image */}
      <div className="relative">
        <img
          src={property.image}
          alt={property.title}
          className="h-56 w-full object-cover"
        />

        <div className="absolute left-3 top-3 flex gap-2">
          {property.available && (
            <span className="rounded-full bg-emeraldAccent px-3 py-1 text-xs font-semibold text-white shadow-sm">
              Available
            </span>
          )}

          {property.verified && (
            <span className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-emeraldDark shadow-sm">
              <CheckCircle size={12} />
              Verified
            </span>
          )}
        </div>

        {user && (
          <button
            onClick={async (event) => {
              event.stopPropagation();
              try {
                await toggleWishlist(property);
              } catch (error) {
                if (error instanceof Error) {
                  alert(error.message);
                }
              }
            }}
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-emeraldDark shadow transition hover:scale-105"
            aria-label={saved ? "Remove from saved" : "Save property"}
          >
            <Heart
              size={18}
              className={saved ? "fill-red-500 text-red-500" : "text-emeraldDark"}
            />
          </button>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-display text-2xl leading-tight text-emeraldDark">
            {property.title}
          </h2>

          <span className="shrink-0 rounded-2xl bg-mintMist px-3 py-2 text-sm font-bold text-emeraldDark">
            ₹{property.price}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2 text-sm text-fog">
          <MapPin size={14} />
          <span>{property.location}</span>
        </div>

        <p className="mt-1 text-sm text-fog">
          {property.commute
            ? `${property.commute.durationText} drive • ${property.commute.distanceText}`
            : `${property.distance} from office`}
        </p>

        <div className="mt-2 flex items-center gap-1 text-xs text-fog">
          <Star size={13} className="fill-amber-400 text-amber-400" />
          <span className="font-semibold text-inkSlate">{property.rating.toFixed(1)}</span>
          <span>({property.reviewCount} reviews)</span>
        </div>

        {property.socialProof && (
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-mintMist px-3 py-1 font-semibold text-emeraldDark">
              {property.socialProof.interestedLabel}
            </span>
            {property.capacity > 1 && property.socialProof.roommateSeekersCount > 0 && (
              <span className="rounded-full bg-sandstone/80 px-3 py-1 font-semibold text-inkSlate">
                {property.socialProof.roommateSeekersCount} looking for roommate
              </span>
            )}
          </div>
        )}

        {property.socialProof && property.socialProof.colleaguesCount > 0 && (
          <div className="mt-3 flex items-start gap-2 rounded-2xl bg-emeraldAccent/10 px-3 py-2 text-xs text-emeraldDark">
            <Users2 size={14} className="mt-0.5 shrink-0" />
            <p>
              <span className="font-semibold">
                {property.socialProof.colleaguesCount} people from{" "}
                {property.socialProof.companyName}
              </span>{" "}
              are already interested here.
            </p>
          </div>
        )}

        {property.socialProof &&
          property.socialProof.colleaguesCount === 0 &&
          property.socialProof.residentCount > 0 && (
            <p className="mt-3 text-xs text-fog">
              {property.socialProof.interestedLabel} on URBNLY right now.
            </p>
          )}

        <div className="mt-3 flex items-start gap-2 rounded-2xl border border-emeraldAccent/20 bg-mintMist px-3 py-2 text-xs text-emeraldDark">
          <Users2 size={14} className="mt-0.5 shrink-0" />
          <p className="font-semibold">4 people from your office are also living here.</p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/property/${property.id}`, { state: property });
          }}
          className="mt-5 w-full rounded-2xl bg-emeraldDark px-4 py-3 text-sm font-semibold text-white transition hover:bg-emeraldAccent"
        >
          View details
        </button>
      </div>
    </div>
  );
}
