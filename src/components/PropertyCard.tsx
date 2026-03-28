import type { Property } from "../types/property";
import { MapPin, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Props = {
  property: Property;
};

export default function PropertyCard({ property }: Props) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/property/${property.id}`, {state:property})}
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
          {property.distance} from office
        </p>

        {/* CTA */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/property/${property.id}`, {state:property});
          }}
          className="mt-4 w-full bg-emeraldAccent hover:bg-green-600 text-white text-sm py-2.5 rounded-xl transition"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
