import type { Property } from "../types/property";

type Props = {
  property: Property;
};

export default function PropertyCard({ property }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Image */}
      <div className="relative">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-44 object-cover"
        />

        {/* Tags Overlay */}
        <div className="absolute top-2 left-2 flex gap-2">
          {property.available && (
            <span className="bg-emeraldAccent text-white text-xs px-2 py-1 rounded">
              Available
            </span>
          )}

          {property.verified && (
            <span className="bg-white text-emeraldDark text-xs px-2 py-1 rounded shadow">
              Verified
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Title + Price */}
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-sm text-gray-800">
            {property.title}
          </h2>

          <span className="text-emeraldAccent font-semibold">
            ₹{property.price}
          </span>
        </div>

        {/* Location */}
        <p className="text-gray-500 text-xs mt-1">{property.location}</p>

        {/* Distance */}
        <p className="text-gray-500 text-xs mt-1">
          {property.distance} from office
        </p>

        {/* CTA */}
        <button className="mt-3 w-full bg-emeraldAccent hover:bg-green-600 text-white text-sm py-2 rounded-lg transition">
          View Details
        </button>
      </div>
    </div>
  );
}
