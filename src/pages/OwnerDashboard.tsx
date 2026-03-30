import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Building2, CheckCircle2, Home, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import type { Property } from "../types/property";
import { useAuth } from "../context/AuthContext";

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
};

const splitCsv = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [form, setForm] = useState<FormState>(initialForm);
  const [listings, setListings] = useState<Property[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  useEffect(() => {
    loadListings();
  }, []);

  const stats = useMemo(() => {
    const total = listings.length;
    const available = listings.filter((listing) => listing.available).length;
    const unavailable = total - available;

    return { total, available, unavailable };
  }, [listings]);

  const updateField =
    (field: keyof FormState) =>
    (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const value =
        event.target instanceof HTMLInputElement &&
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value;

      setForm((current) => ({
        ...current,
        [field]: value,
      }));
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
        roomType: form.roomType,
        deposit: Number(form.deposit),
        image: form.image,
        images: splitCsv(form.images),
        description: form.description,
        highlights: splitCsv(form.highlights),
        amenities: splitCsv(form.amenities),
        houseRules: splitCsv(form.houseRules),
        foodIncluded: form.foodIncluded,
      });

      setListings((current) => [response.data.property as Property, ...current]);
      setForm(initialForm);
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
                Add new PGs, review your inventory, and switch availability on or
                off without leaving the app.
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
                to="/home"
                className="rounded-2xl bg-emeraldDark px-4 py-3 text-sm font-semibold text-white transition hover:bg-emeraldAccent"
              >
                View marketplace
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
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
            <p className="mt-4 font-display text-4xl text-inkSlate">
              {stats.available}
            </p>
          </div>
          <div className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-float">
            <div className="flex items-center gap-3 text-emeraldDark">
              <Building2 size={18} />
              <span className="text-sm font-semibold uppercase tracking-[0.18em]">
                Waitlist / paused
              </span>
            </div>
            <p className="mt-4 font-display text-4xl text-inkSlate">
              {stats.unavailable}
            </p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-float backdrop-blur">
            <div className="flex items-center gap-3">
              <PlusCircle className="text-emeraldAccent" size={20} />
              <div>
                <h2 className="font-display text-2xl text-emeraldDark">
                  Add a new property
                </h2>
                <p className="text-sm text-fog">
                  Fill the essentials now. We can deepen uploads and richer media in
                  the next iteration.
                </p>
              </div>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  value={form.title}
                  onChange={updateField("title")}
                  placeholder="Property title"
                  className="rounded-2xl border border-emeraldDark/10 px-4 py-3 outline-none focus:border-emeraldAccent focus:ring-4 focus:ring-emeraldAccent/10"
                />
                <input
                  value={form.location}
                  onChange={updateField("location")}
                  placeholder="Location"
                  className="rounded-2xl border border-emeraldDark/10 px-4 py-3 outline-none focus:border-emeraldAccent focus:ring-4 focus:ring-emeraldAccent/10"
                />
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
                  placeholder="Room type"
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
                disabled={submitting}
                className="w-full rounded-2xl bg-emeraldDark px-5 py-3 font-semibold text-white transition hover:bg-emeraldAccent disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Adding property..." : "Add property"}
              </button>
            </form>
          </section>

          <section className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-float backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl text-emeraldDark">
                  Your listings
                </h2>
                <p className="text-sm text-fog">
                  Toggle availability live as rooms fill up.
                </p>
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
                  You do not have any owner listings yet. Add your first property
                  from the form on the left.
                </div>
              ) : (
                listings.map((listing) => (
                  <div
                    key={listing.id}
                    className="rounded-3xl border border-emeraldDark/10 bg-white p-4"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="flex gap-4">
                        <img
                          src={listing.image}
                          alt={listing.title}
                          className="h-24 w-24 rounded-2xl object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-inkSlate">
                            {listing.title}
                          </h3>
                          <p className="mt-1 text-sm text-fog">{listing.location}</p>
                          <p className="mt-2 text-sm font-medium text-emeraldDark">
                            ₹{listing.price} / month
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-start gap-3 md:items-end">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            listing.available
                              ? "bg-emeraldSoft text-emeraldDark"
                              : "bg-sandstone text-inkSlate"
                          }`}
                        >
                          {listing.available ? "Available" : "Paused"}
                        </span>
                        <button
                          onClick={() =>
                            handleAvailabilityToggle(listing.id, listing.available)
                          }
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
      </div>
    </div>
  );
}
