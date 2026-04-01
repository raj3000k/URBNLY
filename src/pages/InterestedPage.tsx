import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { ArrowRight, CalendarDays, Heart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import type { Property } from "../types/property";
import type { Visit } from "../types/visit";
import { useAuth } from "../context/AuthContext";

export default function InterestedPage() {
  const { user } = useAuth();
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadWorkspace = async () => {
      setLoading(true);
      setError("");

      try {
        const [wishlistResponse, visitsResponse] = await Promise.all([
          api.get("/wishlist"),
          api.get("/visits/my"),
        ]);

        setSavedProperties(wishlistResponse.data.data || []);
        setVisits(visitsResponse.data.data || []);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Unable to load your interested workspace");
        } else {
          setError("Unable to load your interested workspace");
        }
      } finally {
        setLoading(false);
      }
    };

    loadWorkspace();
  }, []);

  const nextVisit = useMemo(
    () =>
      [...visits]
        .filter((visit) => ["pending", "confirmed"].includes(visit.status))
        .sort(
          (left, right) =>
            new Date(left.scheduledFor).getTime() - new Date(right.scheduledFor).getTime()
        )[0],
    [visits]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-mintMist via-white to-sandstone/50 px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-float backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emeraldAccent">
                Interested workspace
              </p>
              <h1 className="mt-2 font-display text-3xl text-emeraldDark">
                Welcome back, {user?.name.split(" ")[0]}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-fog">
                Track the stays you care about, upcoming visits, and where you want to move next.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/home"
                className="rounded-2xl bg-emeraldDark px-4 py-3 text-sm font-semibold text-white transition hover:bg-emeraldAccent"
              >
                Explore listings
              </Link>
              <Link
                to="/profile"
                className="rounded-2xl border border-emeraldDark/10 px-4 py-3 text-sm font-semibold text-emeraldDark transition hover:bg-mintMist"
              >
                Update profile
              </Link>
            </div>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-float">
            <div className="flex items-center gap-3 text-emeraldDark">
              <Heart size={18} />
              <span className="text-sm font-semibold uppercase tracking-[0.18em]">
                Saved stays
              </span>
            </div>
            <p className="mt-4 font-display text-4xl text-inkSlate">{savedProperties.length}</p>
          </div>
          <div className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-float">
            <div className="flex items-center gap-3 text-emeraldDark">
              <CalendarDays size={18} />
              <span className="text-sm font-semibold uppercase tracking-[0.18em]">
                Scheduled visits
              </span>
            </div>
            <p className="mt-4 font-display text-4xl text-inkSlate">{visits.length}</p>
          </div>
          <div className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-float">
            <div className="flex items-center gap-3 text-emeraldDark">
              <Sparkles size={18} />
              <span className="text-sm font-semibold uppercase tracking-[0.18em]">
                Next action
              </span>
            </div>
            <p className="mt-4 text-sm font-semibold text-inkSlate">
              {nextVisit ? "Attend your next visit" : "Shortlist a premium stay"}
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-[28px] border border-red-200 bg-white/90 p-5 text-sm text-red-600 shadow-float">
            {error}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <section className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-float backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl text-emeraldDark">Saved properties</h2>
                <p className="text-sm text-fog">Your most promising shortlisted options.</p>
              </div>
              <Link
                to="/saved"
                className="rounded-2xl border border-emeraldDark/10 px-4 py-2 text-sm font-semibold text-emeraldDark transition hover:bg-mintMist"
              >
                View all
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              {loading ? (
                <p className="text-sm text-fog">Loading saved stays...</p>
              ) : savedProperties.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-emeraldDark/15 bg-mintMist/60 p-5 text-sm text-fog">
                  No shortlisted stays yet. Explore the marketplace and save properties you like.
                </div>
              ) : (
                savedProperties.slice(0, 3).map((property) => (
                  <Link
                    key={property.id}
                    to={`/property/${property.id}`}
                    state={property}
                    className="flex items-center gap-4 rounded-3xl border border-emeraldDark/10 bg-white p-4 transition hover:shadow-md"
                  >
                    <img
                      src={property.image}
                      alt={property.title}
                      className="h-20 w-20 rounded-2xl object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-inkSlate">{property.title}</p>
                      <p className="mt-1 text-sm text-fog">{property.location}</p>
                      <p className="mt-2 text-sm font-medium text-emeraldDark">
                        ₹{property.price} / month
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </section>

          <section className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-float backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl text-emeraldDark">Visit pipeline</h2>
                <p className="text-sm text-fog">Keep tabs on your property tours and confirmations.</p>
              </div>
              <Link
                to="/visits"
                className="rounded-2xl border border-emeraldDark/10 px-4 py-2 text-sm font-semibold text-emeraldDark transition hover:bg-mintMist"
              >
                View all
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              {loading ? (
                <p className="text-sm text-fog">Loading visit activity...</p>
              ) : visits.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-emeraldDark/15 bg-mintMist/60 p-5 text-sm text-fog">
                  No visits scheduled yet. When you book a property tour, it will show up here.
                </div>
              ) : (
                visits.slice(0, 3).map((visit) => (
                  <div
                    key={visit.id}
                    className="rounded-3xl border border-emeraldDark/10 bg-white p-4"
                  >
                    <p className="font-semibold text-inkSlate">
                      {visit.property?.title || "Property visit"}
                    </p>
                    <p className="mt-1 text-sm text-fog">
                      {new Date(visit.scheduledFor).toLocaleString()}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm text-fog">{visit.property?.location}</span>
                      <span className="rounded-full bg-sandstone px-3 py-1 text-xs font-semibold capitalize text-inkSlate">
                        {visit.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <section className="rounded-[32px] border border-white/70 bg-emeraldDark p-6 text-white shadow-float">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emeraldSoft">
                Next best move
              </p>
              <h2 className="mt-2 font-display text-3xl">Keep your shortlist moving</h2>
              <p className="mt-2 max-w-2xl text-sm text-emeraldSoft/90">
                Browse premium listings, compare commute quality, and schedule visits before the best rooms get picked.
              </p>
            </div>

            <Link
              to="/home"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-emeraldDark transition hover:bg-sandstone"
            >
              Explore premium stays
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
