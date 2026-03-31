import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  LogOut,
  Mail,
  UserCircle2,
  Users2,
} from "lucide-react";
import axios from "axios";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import type { Property } from "../types/property";
import type { RoommatePreferences } from "../types/match";

const preferenceOptions = {
  sleepSchedule: [
    { value: "", label: "Select sleep style" },
    { value: "early_bird", label: "Early bird" },
    { value: "night_owl", label: "Night owl" },
  ],
  cleanliness: [
    { value: "", label: "Select cleanliness level" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ],
  foodPreference: [
    { value: "", label: "Select food preference" },
    { value: "veg", label: "Veg" },
    { value: "eggetarian", label: "Eggetarian" },
    { value: "any", label: "Any" },
  ],
  socialStyle: [
    { value: "", label: "Select social style" },
    { value: "quiet", label: "Quiet" },
    { value: "balanced", label: "Balanced" },
    { value: "social", label: "Social" },
  ],
  workMode: [
    { value: "", label: "Select work mode" },
    { value: "office", label: "Office" },
    { value: "hybrid", label: "Hybrid" },
    { value: "remote", label: "Remote" },
  ],
};

const emptyPreferences: RoommatePreferences = {
  sleepSchedule: "",
  cleanliness: "",
  foodPreference: "",
  socialStyle: "",
  workMode: "",
  budgetPreference: "",
};

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [form, setForm] = useState({
    name: user?.name || "",
    company: user?.company || "",
    currentPropertyId: user?.currentPropertyId || "",
    lookingForRoommate: user?.lookingForRoommate || false,
    preferences: user?.preferences || emptyPreferences,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      return;
    }

    setForm({
      name: user.name,
      company: user.company || "",
      currentPropertyId: user.currentPropertyId || "",
      lookingForRoommate: user.lookingForRoommate || false,
      preferences: user.preferences || emptyPreferences,
    });
  }, [user]);

  useEffect(() => {
    const fetchPropertyOptions = async () => {
      try {
        const response = await api.get("/properties", {
          params: { page: 1, limit: 50 },
        });
        setProperties(response.data.data || []);
      } catch {
        setProperties([]);
      }
    };

    fetchPropertyOptions();
  }, []);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const selectedProperty = properties.find(
    (property) => property.id === form.currentPropertyId
  );

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await api.patch("/auth/profile", {
        name: form.name.trim(),
        company: form.company.trim(),
        currentPropertyId: form.currentPropertyId,
        lookingForRoommate: form.lookingForRoommate,
        preferences: form.preferences,
      });
      updateUser(response.data.user);
      setMessage("Profile updated. Your discovery and roommate recommendations are refreshed.");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Unable to update your profile.");
      } else {
        setError("Unable to update your profile.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-float backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emeraldSoft text-emeraldDark">
                <UserCircle2 size={34} />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emeraldAccent">
                  Profile
                </p>
                <h1 className="mt-1 font-display text-3xl text-emeraldDark">
                  {user.name}
                </h1>
                <div className="mt-2 flex items-center gap-2 text-sm text-fog">
                  <Mail size={14} />
                  <span>{user.email}</span>
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <section className="rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-float backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emeraldAccent">
              Account details
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-mintMist p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-fog">
                  Full name
                </p>
                <p className="mt-2 text-lg font-semibold text-inkSlate">{user.name}</p>
              </div>
              <div className="rounded-3xl bg-mintMist p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-fog">
                  Email
                </p>
                <p className="mt-2 text-lg font-semibold text-inkSlate">
                  {user.email}
                </p>
              </div>
              <div className="rounded-3xl bg-mintMist p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-fog">
                  Company
                </p>
                <p className="mt-2 text-lg font-semibold text-inkSlate">
                  {user.company || "Add your company"}
                </p>
              </div>
              <div className="rounded-3xl bg-mintMist p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-fog">
                  Current or target PG
                </p>
                <p className="mt-2 text-lg font-semibold text-inkSlate">
                  {selectedProperty?.title || "Not selected yet"}
                </p>
              </div>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSave}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-inkSlate">Full name</span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, name: event.target.value }))
                    }
                    className="w-full rounded-2xl border border-emeraldDark/10 bg-white px-4 py-3 outline-none transition focus:border-emeraldAccent focus:ring-4 focus:ring-emeraldAccent/10"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-inkSlate">Company</span>
                  <div className="relative">
                    <BriefcaseBusiness
                      size={16}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fog"
                    />
                    <input
                      type="text"
                      value={form.company}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, company: event.target.value }))
                      }
                      placeholder="Infosys, Accenture, TCS..."
                      className="w-full rounded-2xl border border-emeraldDark/10 bg-white px-11 py-3 outline-none transition focus:border-emeraldAccent focus:ring-4 focus:ring-emeraldAccent/10"
                    />
                  </div>
                </label>
              </div>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-inkSlate">
                  Current or target PG
                </span>
                <select
                  value={form.currentPropertyId}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      currentPropertyId: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-emeraldDark/10 bg-white px-4 py-3 outline-none transition focus:border-emeraldAccent focus:ring-4 focus:ring-emeraldAccent/10"
                >
                  <option value="">Select later</option>
                  {properties.map((property) => (
                    <option key={property.id} value={property.id}>
                      {property.title} • {property.location}
                    </option>
                  ))}
                </select>
                <span className="text-sm text-fog">
                  We use this to show where colleagues from your company are already
                  living or shortlisting.
                </span>
              </label>

              <label className="flex items-start gap-3 rounded-[24px] border border-emeraldDark/10 bg-white px-4 py-4">
                <input
                  type="checkbox"
                  checked={form.lookingForRoommate}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      lookingForRoommate: event.target.checked,
                    }))
                  }
                  className="mt-1 h-4 w-4 rounded border-emeraldDark/20 text-emeraldDark focus:ring-emeraldAccent"
                />
                <div>
                  <p className="text-sm font-semibold text-inkSlate">I’m looking for a roommate</p>
                  <p className="mt-1 text-sm text-fog">
                    Turn this on if you want to appear in roommate matches for your
                    selected PG. Only your first name will be shown.
                  </p>
                </div>
              </label>

              <div className="rounded-[24px] border border-emeraldDark/10 bg-mintMist/60 p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emeraldAccent">
                  Roommate preferences
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-inkSlate">
                      Sleep schedule
                    </span>
                    <select
                      value={form.preferences.sleepSchedule}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            sleepSchedule: event.target.value,
                          },
                        }))
                      }
                      className="w-full rounded-2xl border border-emeraldDark/10 bg-white px-4 py-3 outline-none transition focus:border-emeraldAccent focus:ring-4 focus:ring-emeraldAccent/10"
                    >
                      {preferenceOptions.sleepSchedule.map((option) => (
                        <option key={option.value || "sleep-empty"} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-inkSlate">
                      Cleanliness
                    </span>
                    <select
                      value={form.preferences.cleanliness}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            cleanliness: event.target.value,
                          },
                        }))
                      }
                      className="w-full rounded-2xl border border-emeraldDark/10 bg-white px-4 py-3 outline-none transition focus:border-emeraldAccent focus:ring-4 focus:ring-emeraldAccent/10"
                    >
                      {preferenceOptions.cleanliness.map((option) => (
                        <option
                          key={option.value || "cleanliness-empty"}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-inkSlate">
                      Food preference
                    </span>
                    <select
                      value={form.preferences.foodPreference}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            foodPreference: event.target.value,
                          },
                        }))
                      }
                      className="w-full rounded-2xl border border-emeraldDark/10 bg-white px-4 py-3 outline-none transition focus:border-emeraldAccent focus:ring-4 focus:ring-emeraldAccent/10"
                    >
                      {preferenceOptions.foodPreference.map((option) => (
                        <option key={option.value || "food-empty"} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-inkSlate">
                      Social style
                    </span>
                    <select
                      value={form.preferences.socialStyle}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            socialStyle: event.target.value,
                          },
                        }))
                      }
                      className="w-full rounded-2xl border border-emeraldDark/10 bg-white px-4 py-3 outline-none transition focus:border-emeraldAccent focus:ring-4 focus:ring-emeraldAccent/10"
                    >
                      {preferenceOptions.socialStyle.map((option) => (
                        <option key={option.value || "social-empty"} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-inkSlate">Work mode</span>
                    <select
                      value={form.preferences.workMode}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            workMode: event.target.value,
                          },
                        }))
                      }
                      className="w-full rounded-2xl border border-emeraldDark/10 bg-white px-4 py-3 outline-none transition focus:border-emeraldAccent focus:ring-4 focus:ring-emeraldAccent/10"
                    >
                      {preferenceOptions.workMode.map((option) => (
                        <option key={option.value || "work-empty"} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-inkSlate">
                      Comfortable budget
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="500"
                      value={form.preferences.budgetPreference}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            budgetPreference: event.target.value,
                          },
                        }))
                      }
                      placeholder="14000"
                      className="w-full rounded-2xl border border-emeraldDark/10 bg-white px-4 py-3 outline-none transition focus:border-emeraldAccent focus:ring-4 focus:ring-emeraldAccent/10"
                    />
                  </label>
                </div>
              </div>

              {message && (
                <div className="rounded-2xl border border-emeraldAccent/20 bg-emeraldAccent/10 px-4 py-3 text-sm text-emeraldDark">
                  {message}
                </div>
              )}

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="rounded-2xl bg-emeraldDark px-5 py-3 font-semibold text-white transition hover:bg-emeraldAccent disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? "Saving..." : "Save profile"}
              </button>
            </form>
          </section>

          <aside className="rounded-[28px] border border-emeraldDark/10 bg-emeraldDark p-6 text-white shadow-float">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emeraldSoft">
              Colleague signal
            </p>
            <h2 className="mt-3 font-display text-2xl">Make the search smarter</h2>
            <p className="mt-3 text-sm leading-6 text-emeraldSoft/90">
              Once your company and stay preference are set, Urbanly starts surfacing
              stronger social proof across the marketplace.
            </p>

            <div className="mt-6 rounded-[24px] bg-white/10 p-4">
              <div className="flex items-center gap-3">
                <Users2 size={18} className="text-emeraldSoft" />
                <div>
                  <p className="text-sm font-semibold text-white">Colleagues live here</p>
                  <p className="text-xs text-emeraldSoft">
                    See properties where people from your company already stay.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Link
                to="/home"
                className="block rounded-2xl bg-white px-4 py-3 text-center font-semibold text-emeraldDark transition hover:bg-sandstone"
              >
                Explore properties
              </Link>
              <Link
                to="/dashboard"
                className="block rounded-2xl bg-emeraldAccent px-4 py-3 text-center font-semibold text-white transition hover:bg-emeraldDark"
              >
                Open owner dashboard
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
