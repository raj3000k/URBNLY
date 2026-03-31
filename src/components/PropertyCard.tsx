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
      className="cursor-pointer bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition duration-200"
    >
      {/* Image */}
      <div className="relative">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-48 object-cover"
        />

        {/* Tags */}
        <div className="absolute top-3 left-3 flex gap-2">
          {property.available && (
            <span className="bg-emeraldAccent text-white text-xs px-2 py-1 rounded-md">
              Available
            </span>
          )}

          {property.verified && (
            <span className="bg-white text-emeraldDark text-xs px-2 py-1 rounded-md flex items-center gap-1 shadow">
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

      {/* Content */}
      <div className="p-4">
        {/* Title + Price */}
        <div className="flex justify-between items-start">
          <h2 className="font-semibold text-gray-800 text-sm leading-tight">
            {property.title}
          </h2>

          <span className="text-emeraldAccent font-semibold text-sm">
            ₹{property.price}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 mt-2 text-gray-500 text-xs">
          <MapPin size={14} />
          <span>{property.location}</span>
        </div>

        {/* Distance */}
        <p className="text-gray-500 text-xs mt-1">
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
              {property.socialProof.interestedLabel} on Urbanly right now.
            </p>
          )}

        {/* CTA */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/property/${property.id}`, { state: property });
          }}
          className="mt-4 w-full bg-emeraldAccent hover:bg-green-600 text-white text-sm py-2.5 rounded-xl transition"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
