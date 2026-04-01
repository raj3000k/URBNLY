import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  Home,
  MapPin,
  Plus,
  PlusCircle,
  Search,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import type { Property } from "../types/property";
import type { OwnerVisit, VisitStatus } from "../types/visit";
import { useAuth } from "../context/AuthContext";
import useDebounce from "../hooks/useDebounce";
import type { PlaceSuggestion } from "../types/place";

type FormState = {
  title: string;
  location: string;
  price: string;
  distance: string;
  roomType: string;
  deposit: string;
  image: string;
  images: string;
  description: string;
  highlights: string;
  amenities: string;
  houseRules: string;
  foodIncluded: boolean;
  totalRooms: number;
  occupiedRooms: number;
};

type RoomInventoryItem = {
  id: string;
  type: string;
  count: number;
};

const initialForm: FormState = {
  title: "",
  location: "",
  price: "",
  distance: "",
  roomType: "",
  deposit: "",
  image: "",
  images: "",
  description: "",
  highlights: "",
  amenities: "",
  houseRules: "",
  foodIncluded: true,
  totalRooms: 1,
  occupiedRooms: 0,
};

const createInitialRoomInventory = (): RoomInventoryItem[] => [
  {
    id: crypto.randomUUID(),
    type: "Single room",
    count: 1,
  },
];

const splitCsv = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [form, setForm] = useState<FormState>(initialForm);
  const [roomInventory, setRoomInventory] = useState<RoomInventoryItem[]>(
    createInitialRoomInventory()
  );
  const [locationQuery, setLocationQuery] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState<PlaceSuggestion[]>([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [placesSessionToken, setPlacesSessionToken] = useState("");
  const [listings, setListings] = useState<Property[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [ownerVisits, setOwnerVisits] = useState<OwnerVisit[]>([]);
  const [loadingVisits, setLoadingVisits] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const debouncedLocationQuery = useDebounce(locationQuery, 350);

  const loadListings = async () => {
    setLoadingListings(true);

    try {
      const response = await api.get("/properties/owner/listings");
      setListings(response.data.data as Property[]);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Unable to load your listings");
      } else {
        setError("Unable to load your listings");
      }
    } finally {
      setLoadingListings(false);
    }
  };

  const loadOwnerVisits = async () => {
    setLoadingVisits(true);

    try {
      const response = await api.get("/visits/owner");
      setOwnerVisits(response.data.data as OwnerVisit[]);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Unable to load visit requests");
      } else {
        setError("Unable to load visit requests");
      }
    } finally {
      setLoadingVisits(false);
    }
  };

  useEffect(() => {
    loadListings();
    loadOwnerVisits();
  }, []);

  useEffect(() => {
    const nextTotalRooms = roomInventory.reduce((sum, item) => sum + item.count, 0) || 1;

    setForm((current) => ({
      ...current,
      totalRooms: nextTotalRooms,
      occupiedRooms: Math.min(current.occupiedRooms, nextTotalRooms),
    }));
  }, [roomInventory]);

  useEffect(() => {
    if (debouncedLocationQuery.trim().length < 3 || debouncedLocationQuery === form.location) {
      setLocationSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const sessionToken = placesSessionToken || crypto.randomUUID();

    if (!placesSessionToken) {
      setPlacesSessionToken(sessionToken);
    }

    const fetchSuggestions = async () => {
      setLocationLoading(true);

      try {
        const response = await api.post(
          "/places/autocomplete",
          {
            input: debouncedLocationQuery.trim(),
            sessionToken,
          },
          { signal: controller.signal }
        );

        setLocationSuggestions(response.data.data || []);
      } catch {
        setLocationSuggestions([]);
      } finally {
        setLocationLoading(false);
      }
    };

    fetchSuggestions();

    return () => controller.abort();
  }, [debouncedLocationQuery, form.location, placesSessionToken]);

  const stats = useMemo(() => {
    const total = listings.length;
    const available = listings.filter((listing) => listing.available).length;
    const unavailable = total - available;
    const pendingVisits = ownerVisits.filter((visit) => visit.status === "pending").length;

    return { total, available, unavailable, pendingVisits };
  }, [listings, ownerVisits]);

  const freeRooms = Math.max(form.totalRooms - form.occupiedRooms, 0);

  const updateField =
    (field: keyof FormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value =
        event.target instanceof HTMLInputElement && event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value;

      setForm((current) => ({
        ...current,
        [field]: value,
      }));
    };

  const handleSuggestionSelect = async (suggestion: PlaceSuggestion) => {
    try {
      const response = await api.post("/places/details", {
        placeId: suggestion.placeId,
        sessionToken: placesSessionToken || crypto.randomUUID(),
      });

      setForm((current) => ({
        ...current,
        location: response.data.label || suggestion.text,
      }));
      setLocationQuery(response.data.label || suggestion.text);
      setLocationSuggestions([]);
      setPlacesSessionToken("");
    } catch {
      setForm((current) => ({ ...current, location: suggestion.text }));
      setLocationQuery(suggestion.text);
      setLocationSuggestions([]);
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setError("Location detection is not supported in this browser.");
      return;
    }

    setDetectingLocation(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await api.post("/places/reverse-geocode", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });

          setForm((current) => ({
            ...current,
            location: response.data.label,
          }));
          setLocationQuery(response.data.label);
          setLocationSuggestions([]);
          setPlacesSessionToken("");
        } catch (err) {
          if (axios.isAxiosError(err)) {
            setError(err.response?.data?.message || "Unable to detect your property location");
          } else {
            setError("Unable to detect your property location");
          }
        } finally {
          setDetectingLocation(false);
        }
      },
      () => {
        setDetectingLocation(false);
        setError("Unable to access your current location.");
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  const updateRoomInventory = (id: string, updates: Partial<RoomInventoryItem>) => {
    setRoomInventory((current) =>
      current.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const incrementRoomType = (id: string) => {
    setRoomInventory((current) =>
      current.map((item) => (item.id === id ? { ...item, count: item.count + 1 } : item))
    );
  };

  const decrementRoomType = (id: string) => {
    setRoomInventory((current) =>
      current.map((item) =>
        item.id === id ? { ...item, count: Math.max(item.count - 1, 1) } : item
      )
    );
  };

  const addRoomType = () => {
    setRoomInventory((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        type: "",
        count: 1,
      },
    ]);
  };

  const removeRoomType = (id: string) => {
    setRoomInventory((current) => {
      if (current.length === 1) {
        return current;
      }

      return current.filter((item) => item.id !== id);
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.post("/properties", {
        title: form.title,
        location: form.location,
        price: Number(form.price),
        distance: form.distance,
        roomType:
          form.roomType || roomInventory.map((item) => `${item.type} x${item.count}`).join(", "),
        deposit: Number(form.deposit),
        image: form.image,
        images: splitCsv(form.images),
        description: form.description,
        highlights: splitCsv(form.highlights),
        amenities: splitCsv(form.amenities),
        houseRules: splitCsv(form.houseRules),
        foodIncluded: form.foodIncluded,
        totalRooms: form.totalRooms,
        occupiedRooms: form.occupiedRooms,
        roomInventory: roomInventory.map(({ type, count }) => ({ type, count })),
      });

      setListings((current) => [response.data.property as Property, ...current]);
      setForm(initialForm);
      setLocationQuery("");
      setLocationSuggestions([]);
      setPlacesSessionToken("");
      setRoomInventory(createInitialRoomInventory());
      setSuccess("Property added to your dashboard.");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Unable to add property");
      } else {
        setError("Unable to add property");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleAvailabilityToggle = async (propertyId: string, available: boolean) => {
    try {
      const response = await api.patch(`/properties/${propertyId}/availability`, {
        available: !available,
      });

      setListings((current) =>
        current.map((listing) =>
          listing.id === propertyId ? (response.data.property as Property) : listing
        )
      );
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Unable to update availability");
      } else {
        setError("Unable to update availability");
      }
    }
  };

  const handleVisitStatusUpdate = async (visitId: string, status: VisitStatus) => {
    try {
      const response = await api.patch(`/visits/${visitId}/status`, { status });

      setOwnerVisits((current) =>
        current.map((visit) =>
          visit.id === visitId ? (response.data.visit as OwnerVisit) : visit
        )
      );
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Unable to update the visit");
      } else {
        setError("Unable to update the visit");
      }
    }
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-float backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emeraldAccent">
                Owner dashboard
              </p>
              <h1 className="mt-2 font-display text-3xl text-emeraldDark">
                Manage your listings, {user?.name.split(" ")[0]}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-fog">
                Add new PGs, review your inventory, and switch availability on or off with structured listing controls.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/profile"
                className="rounded-2xl border border-emeraldDark/10 px-4 py-3 text-sm font-semibold text-emeraldDark transition hover:bg-mintMist"
              >
                Back to profile
              </Link>
              <Link
                to="/"
                className="rounded-2xl bg-emeraldDark px-4 py-3 text-sm font-semibold text-white transition hover:bg-emeraldAccent"
              >
                View public site
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-float">
            <div className="flex items-center gap-3 text-emeraldDark">
              <Home size={18} />
              <span className="text-sm font-semibold uppercase tracking-[0.18em]">
                Total listings
              </span>
            </div>
            <p className="mt-4 font-display text-4xl text-inkSlate">{stats.total}</p>
          </div>
          <div className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-float">
            <div className="flex items-center gap-3 text-emeraldDark">
              <CheckCircle2 size={18} />
              <span className="text-sm font-semibold uppercase tracking-[0.18em]">
                Available now
              </span>
            </div>
            <p className="mt-4 font-display text-4xl text-inkSlate">{stats.available}</p>
          </div>
          <div className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-float">
            <div className="flex items-center gap-3 text-emeraldDark">
              <Building2 size={18} />
              <span className="text-sm font-semibold uppercase tracking-[0.18em]">
                Waitlist / paused
              </span>
            </div>
            <p className="mt-4 font-display text-4xl text-inkSlate">{stats.unavailable}</p>
          </div>
          <div className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-float">
            <div className="flex items-center gap-3 text-emeraldDark">
              <CalendarDays size={18} />
              <span className="text-sm font-semibold uppercase tracking-[0.18em]">
                Pending visits
              </span>
            </div>
            <p className="mt-4 font-display text-4xl text-inkSlate">{stats.pendingVisits}</p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-float backdrop-blur">
            <div className="flex items-center gap-3">
              <PlusCircle className="text-emeraldAccent" size={20} />
              <div>
                <h2 className="font-display text-2xl text-emeraldDark">Add a new property</h2>
                <p className="text-sm text-fog">
                  Use assisted location search, room mix controls, and occupancy counters to build a professional listing.
                </p>
              </div>
            </div>

            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  value={form.title}
                  onChange={updateField("title")}
                  placeholder="Property title"
                  className="rounded-2xl border border-emeraldDark/10 px-4 py-3 outline-none focus:border-emeraldAccent focus:ring-4 focus:ring-emeraldAccent/10"
                />

                <div className="relative md:col-span-1">
                  <Search size={16} className="pointer-events-none absolute left-4 top-4 text-fog" />
                  <input
                    value={locationQuery}
                    onChange={(event) => {
                      setLocationQuery(event.target.value);
                      setForm((current) => ({ ...current, location: event.target.value }));
                    }}
                    placeholder="Search listing location"
                    className="w-full rounded-2xl border border-emeraldDark/10 px-11 py-3 outline-none focus:border-emeraldAccent focus:ring-4 focus:ring-emeraldAccent/10"
                  />

                  {locationSuggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-2xl border border-emeraldDark/10 bg-white shadow-float">
                      {locationSuggestions.map((suggestion) => (
                        <button
                          key={suggestion.placeId}
                          type="button"
                          onClick={() => handleSuggestionSelect(suggestion)}
                          className="block w-full border-b border-emeraldDark/5 px-4 py-3 text-left transition last:border-b-0 hover:bg-mintMist"
                        >
                          <div className="text-sm font-semibold text-inkSlate">{suggestion.mainText}</div>
                          {suggestion.secondaryText && (
                            <div className="mt-1 text-xs text-fog">{suggestion.secondaryText}</div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleDetectLocation}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emeraldDark/10 px-4 py-3 text-sm font-semibold text-emeraldDark transition hover:bg-mintMist"
                >
                  <MapPin size={16} />
                  {detectingLocation ? "Detecting..." : "Detect location"}
                </button>

                <input
                  value={form.price}
                  onChange={updateField("price")}
                  placeholder="Monthly price"
                  type="number"
                  className="rounded-2xl border border-emeraldDark/10 px-4 py-3 outline-none focus:border-emeraldAccent focus:ring-4 focus:ring-emeraldAccent/10"
                />
                <input
                  value={form.deposit}
                  onChange={updateField("deposit")}
                  placeholder="Security deposit"
                  type="number"
                  className="rounded-2xl border border-emeraldDark/10 px-4 py-3 outline-none focus:border-emeraldAccent focus:ring-4 focus:ring-emeraldAccent/10"
                />
                <input
                  value={form.distance}
                  onChange={updateField("distance")}
                  placeholder="Distance from office"
                  className="rounded-2xl border border-emeraldDark/10 px-4 py-3 outline-none focus:border-emeraldAccent focus:ring-4 focus:ring-emeraldAccent/10"
                />
                <input
                  value={form.roomType}
                  onChange={updateField("roomType")}
                  placeholder="Room mix summary (optional)"
                  className="rounded-2xl border border-emeraldDark/10 px-4 py-3 outline-none focus:border-emeraldAccent focus:ring-4 focus:ring-emeraldAccent/10"
                />
                <input
                  value={form.image}
                  onChange={updateField("image")}
                  placeholder="Cover image URL"
                  className="rounded-2xl border border-emeraldDark/10 px-4 py-3 outline-none focus:border-emeraldAccent focus:ring-4 focus:ring-emeraldAccent/10 md:col-span-2"
                />
                <input
                  value={form.images}
                  onChange={updateField("images")}
                  placeholder="Additional image URLs, comma separated"
                  className="rounded-2xl border border-emeraldDark/10 px-4 py-3 outline-none focus:border-emeraldAccent focus:ring-4 focus:ring-emeraldAccent/10 md:col-span-2"
                />
              </div>

              <div className="rounded-[28px] border border-emeraldDark/10 bg-mintMist/50 p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emeraldAccent">
                      Room inventory
                    </p>
                    <h3 className="mt-2 font-display text-2xl text-emeraldDark">
                      Configure room mix and occupancy
                    </h3>
                    <p className="mt-2 text-sm text-fog">
                      Add each room type and count so your listing stays structured and transparent.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addRoomType}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-emeraldDark transition hover:bg-sandstone"
                  >
                    <Plus size={16} />
                    Add room type
                  </button>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl bg-white px-4 py-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-fog">Total rooms</p>
                    <p className="mt-2 font-display text-3xl text-inkSlate">{form.totalRooms}</p>
                  </div>
                  <div className="rounded-2xl bg-white px-4 py-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-fog">Occupied now</p>
                    <div className="mt-3 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setForm((current) => ({
                            ...current,
                            occupiedRooms: Math.max(current.occupiedRooms - 1, 0),
                          }))
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-emeraldDark/10 bg-mintMist text-lg font-semibold text-emeraldDark"
                      >
                        -
                      </button>
                      <p className="font-display text-3xl text-inkSlate">{form.occupiedRooms}</p>
                      <button
                        type="button"
                        onClick={() =>
                          setForm((current) => ({
                            ...current,
                            occupiedRooms: Math.min(current.occupiedRooms + 1, current.totalRooms),
                          }))
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-emeraldDark/10 bg-mintMist text-lg font-semibold text-emeraldDark"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white px-4 py-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-fog">Free right now</p>
                    <p className="mt-2 font-display text-3xl text-inkSlate">{freeRooms}</p>
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  {roomInventory.map((item) => (
                    <div
                      key={item.id}
                      className="grid gap-4 rounded-2xl border border-white/70 bg-white p-4 md:grid-cols-[1.2fr_0.8fr_auto]"
                    >
                      <input
                        value={item.type}
                        onChange={(event) => updateRoomInventory(item.id, { type: event.target.value })}
                        placeholder="Room type, e.g. Single room, Twin sharing"
                        className="rounded-2xl border border-emeraldDark/10 px-4 py-3 outline-none focus:border-emeraldAccent focus:ring-4 focus:ring-emeraldAccent/10"
                      />

                      <div className="flex items-center justify-between rounded-2xl border border-emeraldDark/10 px-3 py-2">
                        <button
                          type="button"
                          onClick={() => decrementRoomType(item.id)}
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-mintMist text-lg font-semibold text-emeraldDark"
                        >
                          -
                        </button>
                        <div className="text-center">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-fog">Count</p>
                          <p className="font-display text-2xl text-inkSlate">{item.count}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => incrementRoomType(item.id)}
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-mintMist text-lg font-semibold text-emeraldDark"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeRoomType(item.id)}
                        disabled={roomInventory.length === 1}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <textarea
                value={form.description}
                onChange={updateField("description")}
                placeholder="Describe the stay, neighborhood, and ideal tenant"
                rows={4}
                className="w-full rounded-2xl border border-emeraldDark/10 px-4 py-3 outline-none focus:border-emeraldAccent focus:ring-4 focus:ring-emeraldAccent/10"
              />

              <div className="grid gap-4 md:grid-cols-3">
                <textarea
                  value={form.highlights}
                  onChange={updateField("highlights")}
                  placeholder="Highlights, comma separated"
                  rows={4}
                  className="rounded-2xl border border-emeraldDark/10 px-4 py-3 outline-none focus:border-emeraldAccent focus:ring-4 focus:ring-emeraldAccent/10"
                />
                <textarea
                  value={form.amenities}
                  onChange={updateField("amenities")}
                  placeholder="Amenities, comma separated"
                  rows={4}
                  className="rounded-2xl border border-emeraldDark/10 px-4 py-3 outline-none focus:border-emeraldAccent focus:ring-4 focus:ring-emeraldAccent/10"
                />
                <textarea
                  value={form.houseRules}
                  onChange={updateField("houseRules")}
                  placeholder="House rules, comma separated"
                  rows={4}
                  className="rounded-2xl border border-emeraldDark/10 px-4 py-3 outline-none focus:border-emeraldAccent focus:ring-4 focus:ring-emeraldAccent/10"
                />
              </div>

              <label className="flex items-center gap-3 rounded-2xl bg-mintMist px-4 py-3 text-sm font-medium text-inkSlate">
                <input
                  checked={form.foodIncluded}
                  onChange={updateField("foodIncluded")}
                  type="checkbox"
                />
                Food included in the monthly rent
              </label>

              {error && (
                <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </p>
              )}

              {success && (
                <p className="rounded-2xl border border-emeraldAccent/20 bg-emeraldSoft px-4 py-3 text-sm text-emeraldDark">
                  {success}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting || locationLoading}
                className="w-full rounded-2xl bg-emeraldDark px-5 py-3 font-semibold text-white transition hover:bg-emeraldAccent disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Adding property..." : "Publish property"}
              </button>
            </form>
          </section>

          <section className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-float backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl text-emeraldDark">Your listings</h2>
                <p className="text-sm text-fog">Toggle availability live as rooms fill up.</p>
              </div>
              <button
                onClick={loadListings}
                className="rounded-2xl border border-emeraldDark/10 px-4 py-2 text-sm font-semibold text-emeraldDark transition hover:bg-mintMist"
              >
                Refresh
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {loadingListings ? (
                <p className="text-sm text-fog">Loading your properties...</p>
              ) : listings.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-emeraldDark/15 bg-mintMist/60 p-6 text-sm text-fog">
                  You do not have any owner listings yet. Add your first property from the form on the left.
                </div>
              ) : (
                listings.map((listing) => (
                  <div key={listing.id} className="rounded-3xl border border-emeraldDark/10 bg-white p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="flex gap-4">
                        <img
                          src={listing.image}
                          alt={listing.title}
                          className="h-24 w-24 rounded-2xl object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-inkSlate">{listing.title}</h3>
                          <p className="mt-1 text-sm text-fog">{listing.location}</p>
                          <p className="mt-2 text-sm font-medium text-emeraldDark">₹{listing.price} / month</p>
                          <p className="mt-2 text-xs text-fog">
                            {listing.freeRooms} free of {listing.totalRooms} rooms • {listing.occupiedRooms} occupied
                          </p>
                          {listing.roomInventory.length > 0 && (
                            <p className="mt-2 text-xs text-fog">
                              {listing.roomInventory.map((item) => `${item.type} x${item.count}`).join(" • ")}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-start gap-3 md:items-end">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            listing.available ? "bg-emeraldSoft text-emeraldDark" : "bg-sandstone text-inkSlate"
                          }`}
                        >
                          {listing.available ? "Available" : "Paused"}
                        </span>
                        <button
                          onClick={() => handleAvailabilityToggle(listing.id, listing.available)}
                          className="rounded-2xl border border-emeraldDark/10 px-4 py-2 text-sm font-semibold text-emeraldDark transition hover:bg-mintMist"
                        >
                          Mark as {listing.available ? "unavailable" : "available"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <section className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-float backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl text-emeraldDark">Visit requests</h2>
              <p className="text-sm text-fog">
                Confirm, complete, or decline property tours requested by users.
              </p>
            </div>
            <button
              onClick={loadOwnerVisits}
              className="rounded-2xl border border-emeraldDark/10 px-4 py-2 text-sm font-semibold text-emeraldDark transition hover:bg-mintMist"
            >
              Refresh
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {loadingVisits ? (
              <p className="text-sm text-fog">Loading visit requests...</p>
            ) : ownerVisits.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-emeraldDark/15 bg-mintMist/60 p-6 text-sm text-fog">
                No visit requests yet. As users schedule tours, they will appear here.
              </div>
            ) : (
              ownerVisits.map((visit) => (
                <div key={visit.id} className="rounded-3xl border border-emeraldDark/10 bg-white p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex gap-4">
                      <img
                        src={visit.property.image}
                        alt={visit.property.title}
                        className="hidden h-24 w-24 rounded-2xl object-cover sm:block"
                      />
                      <div>
                        <h3 className="font-semibold text-inkSlate">{visit.property.title}</h3>
                        <p className="mt-1 text-sm text-fog">{visit.property.location}</p>
                        <p className="mt-3 text-sm font-medium text-emeraldDark">
                          {visit.visitor.name}
                          {visit.visitor.company ? ` • ${visit.visitor.company}` : ""}
                        </p>
                        <p className="mt-1 text-sm text-fog">{visit.visitor.email}</p>
                        <p className="mt-1 text-sm text-fog">{visit.phone}</p>
                        <p className="mt-2 text-sm text-fog">
                          Visit: {new Date(visit.scheduledFor).toLocaleString()}
                        </p>
                        {visit.notes && (
                          <p className="mt-3 rounded-2xl bg-mintMist px-4 py-3 text-sm text-inkSlate">
                            {visit.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3 lg:text-right">
                      <span className="inline-flex rounded-full bg-sandstone px-3 py-1 text-xs font-semibold capitalize text-inkSlate">
                        {visit.status}
                      </span>
                      <div className="flex flex-wrap gap-2 lg:justify-end">
                        <button
                          onClick={() => handleVisitStatusUpdate(visit.id, "confirmed")}
                          className="rounded-2xl border border-emeraldDark/10 px-3 py-2 text-sm font-semibold text-emeraldDark transition hover:bg-mintMist"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleVisitStatusUpdate(visit.id, "completed")}
                          className="rounded-2xl border border-emeraldDark/10 px-3 py-2 text-sm font-semibold text-emeraldDark transition hover:bg-mintMist"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => handleVisitStatusUpdate(visit.id, "cancelled")}
                          className="rounded-2xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
