import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

type FormState = {
  name: string;
  email: string;
  company: string;
  password: string;
  confirmPassword: string;
};

export default function Register() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    company: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login, user } = useAuth();

  if (user) {
    return <Navigate to={user.role === "owner" ? "/dashboard" : "/interested"} replace />;
  }

  const validationMessage = useMemo(() => {
    if (!form.name.trim()) return "Please enter your name.";
    if (!form.email.trim()) return "Please enter your email address.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      return "Please enter a valid email address.";
    }
    if (form.password.length < 6) {
      return "Password must be at least 6 characters long.";
    }
    if (form.password !== form.confirmPassword) {
      return "Passwords do not match.";
    }
    return "";
  }, [form]);

  const updateField =
    (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({
        ...current,
        [field]: event.target.value,
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
    <div className="min-h-screen bg-hero-grid bg-hero-grid px-4 py-10">
      <div className="mx-auto max-w-lg rounded-[28px] border border-white/70 bg-white/90 p-8 shadow-float backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emeraldAccent">
          URBNLY
        </p>
        <h1 className="mt-3 font-display text-3xl text-emeraldDark">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-fog">
          Create your account to unlock the app experience, save listings, and
          compare stays by commute and fit.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
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

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-inkSlate">Company</span>
            <input
              value={form.company}
              onChange={updateField("company")}
              placeholder="Infosys, TCS, Wipro..."
              className="w-full rounded-2xl border border-emeraldDark/10 bg-white px-4 py-3 outline-none transition focus:border-emeraldAccent focus:ring-4 focus:ring-emeraldAccent/10"
            />
          </label>

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

          {(error || validationMessage) && (
            <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              {error || validationMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-emeraldDark px-4 py-3 font-semibold text-white transition hover:bg-emeraldAccent disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-fog">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-emeraldDark">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
