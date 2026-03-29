import { useEffect, useState } from "react";
import api from "../utils/api";
import PropertyCard from "../components/PropertyCard";
import SearchBar from "../components/SearchBar";
import RecommendationBanner from "../components/RecommendationBanner";
import Filters from "../components/Filters";
import SkeletonCard from "../components/SkeletonCard";
import type { Property } from "../types/property";
import useDebounce from "../hooks/useDebounce";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [budget, setBudget] = useState<number | null>(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { user, logout } = useAuth();

  const debouncedSearch = useDebounce(search, 300);

  // Reset on search/filter change
  useEffect(() => {
    setPage(1);
    setProperties([]);
  }, [debouncedSearch, budget]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProperties = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await api.get("/properties", {
          params: {
            search: debouncedSearch,
            budget: budget || undefined,
            page,
            limit: 5,
          },
          signal: controller.signal,
        });

        const newData = res.data.data;

        setProperties((prev) => (page === 1 ? newData : [...prev, ...newData]));

        setHasMore(newData.length > 0);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        if (err.name !== "CanceledError") {
          setError("Failed to load properties");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();

    return () => controller.abort();
  }, [debouncedSearch, budget, page]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 100 &&
        hasMore &&
        !loading
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-emeraldDark">Urbanly</h1>

        {user && (
          <div className="flex items-center gap-3">
            <Link
              to="/saved"
              className="rounded-lg border border-emeraldAccent/20 bg-emeraldAccent/10 px-3 py-1 text-sm font-semibold text-emeraldDark"
            >
              Saved
            </Link>
            <Link
              to="/profile"
              className="rounded-lg border border-emeraldDark/10 px-3 py-1 text-sm font-semibold text-emeraldDark"
            >
              {user.name.split(" ")[0]}
            </Link>
            <button
              onClick={logout}
              className="text-sm text-red-500 border border-red-300 px-3 py-1 rounded-lg"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      <SearchBar value={search} onChange={setSearch} />
      <RecommendationBanner />
      <Filters selected={budget} onBudgetChange={setBudget} />

      {/* Initial Loading */}
      {loading && page === 1 && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Empty */}
      {!loading && !error && properties.length === 0 && (
        <p className="text-gray-500 text-sm">No properties found</p>
      )}

      {/* Listings */}
      <div className="space-y-4">
        {properties.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>

      {/* Bottom Loader */}
      {loading && page > 1 && (
        <p className="text-center text-gray-400 text-sm">Loading more...</p>
      )}

      {/* End */}
      {!hasMore && !loading && (
        <p className="text-center text-gray-400 text-sm">No more properties</p>
      )}
    </div>
  );
}
