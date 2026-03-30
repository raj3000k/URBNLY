import { useEffect, useMemo, useState } from "react";
import api from "../utils/api";
import PropertyCard from "../components/PropertyCard";
import SearchBar from "../components/SearchBar";
import RecommendationBanner from "../components/RecommendationBanner";
import Filters from "../components/Filters";
import SkeletonCard from "../components/SkeletonCard";
import SortBar, { type SortOption } from "../components/SortBar";
import type { Property } from "../types/property";
import useDebounce from "../hooks/useDebounce";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import type { CommuteInfo } from "../types/commute";
import type { PlaceSuggestion, SelectedPlace } from "../types/place";

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [budget, setBudget] = useState<number | null>(null);
  const [officeQuery, setOfficeQuery] = useState("");
  const [selectedOffice, setSelectedOffice] = useState<SelectedPlace | null>(null);
  const [officeSuggestions, setOfficeSuggestions] = useState<PlaceSuggestion[]>([]);
  const [placesLoading, setPlacesLoading] = useState(false);
  const [placesSessionToken, setPlacesSessionToken] = useState("");
  const [commuteLoading, setCommuteLoading] = useState(false);
  const [commuteMessage, setCommuteMessage] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("recommended");

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { user, logout } = useAuth();

  const debouncedSearch = useDebounce(search, 300);
  const debouncedOfficeQuery = useDebounce(officeQuery, 350);
  const propertyIdsSignature = properties.map((property) => property.id).join(",");

  const sortedProperties = useMemo(() => {
    const list = [...properties];

    const parseDistance = (property: Property) => {
      const value = property.commute?.distanceText || property.distance;
      const parsed = Number.parseFloat(value);
      return Number.isFinite(parsed) ? parsed : Number.MAX_SAFE_INTEGER;
    };

    switch (sortBy) {
      case "distance":
        return list.sort((a, b) => parseDistance(a) - parseDistance(b));
      case "price_low":
        return list.sort((a, b) => a.price - b.price);
      case "price_high":
        return list.sort((a, b) => b.price - a.price);
      case "rating":
        return list.sort((a, b) => {
          if (b.rating !== a.rating) {
            return b.rating - a.rating;
          }
          return b.reviewCount - a.reviewCount;
        });
      case "recommended":
      default:
        return list.sort((a, b) => {
          const scoreA =
            a.rating * 20 +
            (a.verified ? 8 : 0) +
            (a.available ? 6 : 0) -
            parseDistance(a) * 1.5;
          const scoreB =
            b.rating * 20 +
            (b.verified ? 8 : 0) +
            (b.available ? 6 : 0) -
            parseDistance(b) * 1.5;

          return scoreB - scoreA;
        });
    }
  }, [properties, sortBy]);

  useEffect(() => {
    const storedOffice = localStorage.getItem("selectedOffice");

    if (storedOffice) {
      const parsedOffice = JSON.parse(storedOffice) as SelectedPlace;
      setSelectedOffice(parsedOffice);
      setOfficeQuery(parsedOffice.label);
    }
  }, []);

  useEffect(() => {
    if (selectedOffice) {
      localStorage.setItem("selectedOffice", JSON.stringify(selectedOffice));
      return;
    }

    localStorage.removeItem("selectedOffice");
  }, [selectedOffice]);

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

  useEffect(() => {
    if (debouncedOfficeQuery.trim().length < 3 || selectedOffice?.label === officeQuery.trim()) {
      setOfficeSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const sessionToken = placesSessionToken || crypto.randomUUID();

    if (!placesSessionToken) {
      setPlacesSessionToken(sessionToken);
    }

    const fetchSuggestions = async () => {
      setPlacesLoading(true);

      try {
        const response = await api.post(
          "/places/autocomplete",
          {
            input: debouncedOfficeQuery.trim(),
            sessionToken,
          },
          {
            signal: controller.signal,
          }
        );

        setOfficeSuggestions(response.data.data || []);
      } catch {
        setOfficeSuggestions([]);
      } finally {
        setPlacesLoading(false);
      }
    };

    fetchSuggestions();

    return () => controller.abort();
  }, [debouncedOfficeQuery, officeQuery, selectedOffice?.label]);

  useEffect(() => {
    if (!selectedOffice || properties.length === 0) {
      setProperties((current) =>
        current.map((property) => ({
          ...property,
          commute: undefined,
        }))
      );
      setCommuteMessage("");
      return;
    }

    const controller = new AbortController();

    const fetchCommute = async () => {
      setCommuteLoading(true);

      try {
        const response = await api.post(
          "/commute",
          {
            officeLocation: selectedOffice.label,
            officeCoordinates: selectedOffice.location,
            propertyIds: properties.map((property) => property.id),
          },
          {
            signal: controller.signal,
          }
        );

        const commuteMap = new Map<string, CommuteInfo>();

        response.data.data.forEach(
          (commute: CommuteInfo & { propertyId: string }) => {
            commuteMap.set(commute.propertyId, {
              officeLocation: commute.officeLocation,
              distanceText: commute.distanceText,
              durationText: commute.durationText,
              source: commute.source,
              status: commute.status,
            });
          }
        );

        setProperties((current) =>
          current.map((property) => ({
            ...property,
            commute: commuteMap.get(property.id),
          }))
        );
        setCommuteMessage(response.data.message || "");
      } catch (err) {
        if (
          !(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            typeof err === "object" && err && (err as any).name === "CanceledError"
          )
        ) {
          setCommuteMessage("Unable to refresh commute estimates right now.");
        }
      } finally {
        setCommuteLoading(false);
      }
    };

    fetchCommute();

    return () => controller.abort();
  }, [selectedOffice, propertyIdsSignature, properties.length]);

  const handleSuggestionSelect = async (suggestion: PlaceSuggestion) => {
    setOfficeQuery(suggestion.text);
    setOfficeSuggestions([]);
    setCommuteMessage("");

    try {
      const response = await api.post("/places/details", {
        placeId: suggestion.placeId,
        sessionToken: placesSessionToken || crypto.randomUUID(),
      });

      const office = response.data as SelectedPlace;
      setSelectedOffice(office);
      setOfficeQuery(office.label);
      setPlacesSessionToken("");
    } catch {
      setCommuteMessage("Unable to select that office right now.");
    }
  };

  const handleOfficeQueryChange = (value: string) => {
    setOfficeQuery(value);

    if (selectedOffice && value.trim() !== selectedOffice.label) {
      setSelectedOffice(null);
    }

    if (value.trim().length < 3) {
      setPlacesSessionToken("");
    }
  };

  const handleClearOffice = () => {
    setOfficeQuery("");
    setSelectedOffice(null);
    setOfficeSuggestions([]);
    setPlacesSessionToken("");
    setCommuteMessage("");
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setCommuteMessage("Location detection is not supported in this browser.");
      return;
    }

    setLocationLoading(true);
    setCommuteMessage("");
    setOfficeSuggestions([]);
    setPlacesSessionToken("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const detectedOffice: SelectedPlace = {
          placeId: "current-location",
          label: "Current location",
          displayName: "Current location",
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        };

        setSelectedOffice(detectedOffice);
        setOfficeQuery("Current location");
        setCommuteMessage(
          "Using your current location directly to save extra Places API calls."
        );
        setLocationLoading(false);
      },
      (geoError) => {
        setLocationLoading(false);
        setCommuteMessage(
          geoError.message || "Unable to detect your current location."
        );
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

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
            <Link
              to="/dashboard"
              className="rounded-lg border border-emeraldDark/10 px-3 py-1 text-sm font-semibold text-emeraldDark"
            >
              Dashboard
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
      <RecommendationBanner
        officeQuery={officeQuery}
        selectedOfficeLabel={selectedOffice?.label || ""}
        suggestions={officeSuggestions}
        loading={commuteLoading || placesLoading}
        locationLoading={locationLoading}
        message={commuteMessage}
        onOfficeQueryChange={handleOfficeQueryChange}
        onSuggestionSelect={handleSuggestionSelect}
        onClearOffice={handleClearOffice}
        onDetectLocation={handleDetectLocation}
      />
      <Filters selected={budget} onBudgetChange={setBudget} />
      <SortBar value={sortBy} onChange={setSortBy} />

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
        {sortedProperties.map((p) => (
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
