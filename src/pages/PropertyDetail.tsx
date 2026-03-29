import { useLocation, useNavigate } from "react-router-dom";
import type { Property } from "../types/property";
import { ArrowLeft, Heart, MapPin } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

export default function PropertyDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const property = location.state as Property;
  const { toggleWishlist, isSaved } = useWishlist();
  const { user } = useAuth();

  if (!property) {
    return <div className="p-4">No property data found</div>;
  }

  const saved = isSaved(property.id);

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Image Section */}
      <div className="relative">
        <img src={property.image} className="w-full h-64 object-cover" />

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-white p-2 rounded-full shadow"
        >
          <ArrowLeft size={18} />
        </button>

        {user && (
          <button
            onClick={async () => {
              try {
                await toggleWishlist(property);
              } catch (error) {
                if (error instanceof Error) {
                  alert(error.message);
                }
              }
            }}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white p-2 shadow"
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
          <h1 className="text-lg font-semibold text-gray-800">
            {property.title}
          </h1>

          <span className="text-emeraldAccent font-semibold">
            ₹{property.price}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-500 text-sm mt-2">
          <MapPin size={14} />
          {property.location}
        </div>

        {/* Distance */}
        <p className="text-gray-500 text-sm mt-1">
          {property.distance} from your office
        </p>

        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Amenities */}
        <div>
          <h3 className="font-semibold text-gray-800">Amenities</h3>

          <div className="grid grid-cols-2 gap-2 mt-3 text-sm text-gray-600">
            <span>WiFi</span>
            <span>AC</span>
            <span>Food Included</span>
            <span>Power Backup</span>
          </div>
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4">
        <button className="w-full bg-emeraldAccent text-white py-3 rounded-xl font-medium">
          Book Visit
        </button>
      </div>
    </div>
  );
}
