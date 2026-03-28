import { useLocation } from "react-router-dom";
import type { Property } from "../types/property";

export default function PropertyDetail() {
  const location = useLocation();
  const property = location.state as Property;

  if (!property) {
    return <div className="p-4">No property data found</div>;
  }

  return (
    <div className="min-h-screen bg-white p-4">
      {/* Image */}
      <img
        src={property.image}
        className="w-full h-60 object-cover rounded-xl"
      />

      {/* Info */}
      <h1 className="text-xl font-semibold mt-4">{property.title}</h1>

      <p className="text-gray-500 mt-1">{property.location}</p>

      <p className="text-emeraldAccent text-lg font-semibold mt-2">
        ₹{property.price} / month
      </p>

      {/* Distance */}
      <p className="text-gray-500 mt-2 text-sm">
        {property.distance} from your office
      </p>

      {/* Amenities (dummy for now) */}
      <div className="mt-4">
        <h3 className="font-semibold">Amenities</h3>
        <ul className="text-sm text-gray-600 mt-2 space-y-1">
          <li>• WiFi</li>
          <li>• AC</li>
          <li>• Food Included</li>
        </ul>
      </div>

      {/* CTA */}
      <button className="mt-6 w-full bg-emeraldAccent text-white py-3 rounded-xl">
        Book Visit
      </button>
    </div>
  );
}
