import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { BriefcaseBusiness, Home, Sparkles, Users2 } from "lucide-react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import BrandLogo from "../components/BrandLogo";
import LoadingButton from "../components/LoadingButton";
import type { Property } from "../types/property";
import type { RoommatePreferences } from "../types/match";
import { emptyPreferences, preferenceOptions } from "../utils/preferences";

type FormState = {
  name: string;
  email: string;
  company: string;
  currentPropertyId: string;
  lookingForRoommate: boolean;
  preferences: RoommatePreferences;
  password: string;
  confirmPassword: string;
};

export default function Register() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    company: "",
    currentPropertyId: "",
    lookingForRoommate: true,
    preferences: emptyPreferences,
    password: "",
    confirmPassword: "",
  });
  const [properties, setProperties] = useState<Property[]>([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login, user } = useAuth();

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const response = await api.get("/properties", {
          params: { page: 1, limit: 50 },
        });
        setProperties(response.data.data || []);
      } catch {
        setProperties([]);
      }
    };

    loadProperties();
  }, []);

  const validationMessage = useMemo(() => {
    if (!form.name.trim()) return "Please enter your name.";
    if (!form.email.trim()) return "Please enter your email address.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      return "Please enter a valid email address.";
    }
    if (!form.company.trim()) {
      return "Please add the company you work at or will be joining.";
    }
    if (form.password.length < 6) {
      return "Password must be at least 6 characters long.";
    }
    if (form.password !== form.confirmPassword) {
      return "Passwords do not match.";
    }
    return "";
  }, [form]);

  if (user) {
    return <Navigate to={user.role === "owner" ? "/dashboard" : "/interested"} replace />;
  }

  const updateField =
    (field: keyof Omit<FormState, "preferences" | "lookingForRoommate">) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const updatePreference =
    (field: keyof RoommatePreferences) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((current) => ({
        ...current,
        preferences: {
          ...current.preferences,
          [field]: event.target.value,
        },
      }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await api.post("/auth/register", {
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.company.trim(),
        currentPropertyId: form.currentPropertyId,
        lookingForRoommate: form.lookingForRoommate,
        preferences: form.preferences,
        password: form.password,
      });

      login(response.data.user, response.data.token);
      navigate("/interested", { replace: true });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Unable to create your account.");
      } else {
        setError("Unable to create your account.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-enter min-h-screen overflow-x-hidden bg-hero-grid px-3 py-6 sm:px-4 sm:py-10">
      <div className="mx-auto w-full max-w-5xl">
        <div className="grid grid-cols-1 overflow-hidden rounded-[28px] border border-white/70 bg-white/95 shadow-float backdrop-blur lg:grid-cols-[0.9fr_1.35fr]">
          <aside className="min-w-0 bg-emeraldDark p-6 text-white sm:p-8">
            <BrandLogo subtitle="Premium city stays" tone="light" />
            <h1 className="mt-8 max-w-full break-words font-display text-3xl leading-tight sm:text-4xl">
              Build your stay profile once.
            </h1>
            <p className="mt-4 text-sm leading-7 text-emeraldSoft/90">
              URBNLY uses your company, commute intent, and roommate preferences to
              show better stays from day one.
            </p>

            <div className="mt-8 space-y-3">
              {[
                { icon: BriefcaseBusiness, text: "Company-aware property discovery" },
                { icon: Home, text: "Current or target PG context" },
                { icon: Users2, text: "Roommate matching preferences upfront" },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex min-w-0 items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-emeraldSoft"
                >
                  <Icon size={17} className="shrink-0" />
                  <span className="min-w-0 break-words">{text}</span>
                </div>
              ))}
            </div>
          </aside>

          <form className="min-w-0 space-y-6 p-5 sm:p-8" onSubmit={handleSubmit}>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emeraldAccent">
                Customer signup
              </p>
              <h2 className="mt-2 break-words font-display text-2xl text-emeraldDark sm:text-3xl">
                Create your account
              </h2>
              <p className="mt-2 text-sm text-fog">
                You can update these details anytime from your profile.
              </p>
            </div>

            <section className="rounded-[24px] border border-emeraldDark/10 bg-mintMist/50 p-4">
              <div className="flex items-center gap-2 text-emeraldDark">
                <BriefcaseBusiness size={18} />
                <h3 className="font-display text-xl">Work details</h3>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-inkSlate">Full name</span>
                  <input
                    value={form.name}
                    onChange={updateField("name")}
                    placeholder="Raj Motwani"
                    className="w-full rounded-2xl border border-emeraldDark/10 bg-white px-4 py-3 outline-none transition focus:border-emeraldAccent focus:ring-4 focus:ring-emeraldAccent/10"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-inkSlate">Email</span>
                  <input
                    value={form.email}
                    onChange={updateField("email")}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-emeraldDark/10 bg-white px-4 py-3 outline-none transition focus:border-emeraldAccent focus:ring-4 focus:ring-emeraldAccent/10"
                  />
                </label>

                <label className="block space-y-2 sm:col-span-2">
                  <span className="text-sm font-semibold text-inkSlate">
                    Company you work at or will be joining
                  </span>
                  <input
                    value={form.company}
                    onChange={updateField("company")}
                    placeholder="Infosys, TCS, Wipro, Accenture..."
                    className="w-full rounded-2xl border border-emeraldDark/10 bg-white px-4 py-3 outline-none transition focus:border-emeraldAccent focus:ring-4 focus:ring-emeraldAccent/10"
                  />
                </label>

                <label className="block space-y-2 sm:col-span-2">
                  <span className="text-sm font-semibold text-inkSlate">
                    Current or target PG
                  </span>
                  <select
                    value={form.currentPropertyId}
                    onChange={updateField("currentPropertyId")}
                    className="w-full rounded-2xl border border-emeraldDark/10 bg-white px-4 py-3 outline-none transition focus:border-emeraldAccent focus:ring-4 focus:ring-emeraldAccent/10"
                  >
                    <option value="">Select later</option>
                    {properties.map((property) => (
                      <option key={property.id} value={property.id}>
                        {property.title} - {property.location}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </section>

            <section className="rounded-[24px] border border-emeraldDark/10 bg-white p-4">
              <div className="flex items-center gap-2 text-emeraldDark">
                <Sparkles size={18} />
                <h3 className="font-display text-xl">Roommate preferences</h3>
              </div>

              <label className="mt-4 flex items-start gap-3 rounded-[20px] border border-emeraldDark/10 bg-mintMist/60 px-4 py-4">
                <input
                  type="checkbox"
                  checked={form.lookingForRoommate}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      lookingForRoommate: event.target.checked,
                    }))
                  }
                  className="mt-1 h-4 w-4 rounded border-emeraldDark/20 text-emeraldDark focus:ring-emeraldAccent"
                />
                <div>
                  <p className="text-sm font-semibold text-inkSlate">
                    I am open to roommate matches
                  </p>
                  <p className="mt-1 text-sm text-fog">
                    Other users can request to connect only from compatible property pages.
                  </p>
                </div>
              </label>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-inkSlate">Sleep schedule</span>
                  <select
                    value={form.preferences.sleepSchedule}
                    onChange={updatePreference("sleepSchedule")}
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
                  <span className="text-sm font-semibold text-inkSlate">Cleanliness</span>
                  <select
                    value={form.preferences.cleanliness}
                    onChange={updatePreference("cleanliness")}
                    className="w-full rounded-2xl border border-emeraldDark/10 bg-white px-4 py-3 outline-none transition focus:border-emeraldAccent focus:ring-4 focus:ring-emeraldAccent/10"
                  >
                    {preferenceOptions.cleanliness.map((option) => (
                      <option key={option.value || "clean-empty"} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-inkSlate">Food preference</span>
                  <select
                    value={form.preferences.foodPreference}
                    onChange={updatePreference("foodPreference")}
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
                  <span className="text-sm font-semibold text-inkSlate">Social style</span>
                  <select
                    value={form.preferences.socialStyle}
                    onChange={updatePreference("socialStyle")}
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
                    onChange={updatePreference("workMode")}
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
                  <span className="text-sm font-semibold text-inkSlate">Comfortable budget</span>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={form.preferences.budgetPreference}
                    onChange={updatePreference("budgetPreference")}
                    placeholder="14000"
                    className="w-full rounded-2xl border border-emeraldDark/10 bg-white px-4 py-3 outline-none transition focus:border-emeraldAccent focus:ring-4 focus:ring-emeraldAccent/10"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-[24px] border border-emeraldDark/10 bg-mintMist/50 p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-inkSlate">Password</span>
                  <input
                    value={form.password}
                    onChange={updateField("password")}
                    type="password"
                    placeholder="At least 6 characters"
                    className="w-full rounded-2xl border border-emeraldDark/10 bg-white px-4 py-3 outline-none transition focus:border-emeraldAccent focus:ring-4 focus:ring-emeraldAccent/10"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-inkSlate">
                    Confirm password
                  </span>
                  <input
                    value={form.confirmPassword}
                    onChange={updateField("confirmPassword")}
                    type="password"
                    placeholder="Repeat password"
                    className="w-full rounded-2xl border border-emeraldDark/10 bg-white px-4 py-3 outline-none transition focus:border-emeraldAccent focus:ring-4 focus:ring-emeraldAccent/10"
                  />
                </label>
              </div>
            </section>

            {(error || validationMessage) && (
              <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                {error || validationMessage}
              </p>
            )}

            <LoadingButton
              type="submit"
              loading={submitting}
              loadingText="Creating your profile..."
              className="w-full"
            >
              Create account and enter workspace
            </LoadingButton>

            <p className="text-center text-sm text-fog">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-emeraldDark">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
