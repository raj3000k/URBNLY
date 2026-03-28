import { useEffect, useState } from "react";
import api from "../utils/api";
import PropertyCard from "../components/PropertyCard";
import SearchBar from "../components/SearchBar";
import RecommendationBanner from "../components/RecommendationBanner";
import Filters from "../components/Filters";
import SkeletonCard from "../components/SkeletonCard";
import type { Property } from "../types/property";

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await api.get("/properties");
        setProperties(res.data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Failed to load properties");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 space-y-4">
      {/* Header */}
      <h1 className="text-2xl font-semibold text-emeraldDark">Urbanly</h1>

      {/* Search */}
      <SearchBar />

      {/* Recommendation */}
      <RecommendationBanner />

      {/* Filters */}
      <Filters />

      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Empty State */}
      {!loading && !error && properties.length === 0 && (
        <p className="text-gray-500 text-sm">No properties found</p>
      )}

      {/* Listings */}
      {!loading && !error && properties.length > 0 && (
        <div className="space-y-4">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}
