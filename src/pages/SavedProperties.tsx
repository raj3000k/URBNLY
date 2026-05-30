import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import UserNav from "../components/UserNav";
import { useWishlist } from "../context/WishlistContext";

export default function SavedProperties() {
  const { savedProperties, loading } = useWishlist();

  return (
    <div className="page-enter min-h-screen overflow-x-hidden px-3 py-5 sm:px-4 sm:py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <UserNav />

        <div className="rounded-[24px] border border-white/70 bg-white/90 p-4 shadow-float backdrop-blur sm:rounded-[32px] sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emeraldAccent">
                Wishlist
              </p>
              <h1 className="mt-2 font-display text-2xl text-emeraldDark sm:text-3xl">
                Saved properties
              </h1>
              <p className="mt-2 text-sm text-fog">
                Your shortlist stays here so you can compare options and come back
                anytime.
              </p>
            </div>

            <div className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emeraldSoft px-4 py-3 text-sm font-semibold text-emeraldDark">
              <Heart size={16} className="fill-red-500 text-red-500" />
              {savedProperties.length} saved
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-fog">Loading your saved properties...</p>
        ) : savedProperties.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-emeraldDark/20 bg-white/80 p-10 text-center shadow-sm">
            <h2 className="font-display text-2xl text-emeraldDark">
              No saved properties yet
            </h2>
            <p className="mt-3 text-sm text-fog">
              Tap the heart icon on any listing to build your shortlist.
            </p>
            <Link
              to="/interested"
              className="mt-6 inline-block rounded-2xl bg-emeraldDark px-5 py-3 font-semibold text-white transition hover:bg-emeraldAccent"
            >
              Open interested workspace
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {savedProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
