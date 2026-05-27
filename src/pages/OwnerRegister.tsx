import { useMemo, useState } from "react";
import axios from "axios";
import { Link, Navigate, useNavigate } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

type FormState = {
  name: string;
  email: string;
  company: string;
  password: string;
  confirmPassword: string;
};

export default function OwnerRegister() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    company: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const validationMessage = useMemo(() => {
    if (!form.name.trim()) return "Please enter your name.";
    if (!form.email.trim()) return "Please enter your email address.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      return "Please enter a valid email address.";
    }
    if (!form.company.trim()) {
      return "Please enter your company or property group name.";
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
      const response = await api.post("/auth/owner/register", {
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.company.trim(),
        password: form.password,
      });

      login(response.data.user, response.data.token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Unable to create owner account.");
      } else {
        setError("Unable to create owner account.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-enter min-h-screen overflow-x-hidden bg-hero-grid bg-hero-grid px-3 py-6 sm:px-4 sm:py-10">
      <div className="mx-auto max-w-lg rounded-[24px] border border-white/70 bg-white/90 p-5 shadow-float backdrop-blur sm:rounded-[28px] sm:p-8">
        <BrandLogo subtitle="Owner onboarding" />
        <h1 className="mt-3 font-display text-3xl text-emeraldDark">
          Create owner account
        </h1>
        <p className="mt-2 text-sm text-fog">
          Register as a property owner to add listings, manage availability, and
          review visit requests from your dashboard.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-inkSlate">Full name</span>
            <input
              value={form.name}
              onChange={updateField("name")}
              placeholder="Nandini Rao"
              className="w-full rounded-2xl border border-emeraldDark/10 bg-white px-4 py-3 outline-none transition focus:border-emeraldAccent focus:ring-4 focus:ring-emeraldAccent/10"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-inkSlate">Owner email</span>
            <input
              value={form.email}
              onChange={updateField("email")}
              placeholder="host@example.com"
              className="w-full rounded-2xl border border-emeraldDark/10 bg-white px-4 py-3 outline-none transition focus:border-emeraldAccent focus:ring-4 focus:ring-emeraldAccent/10"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-inkSlate">
              Company or property group
            </span>
            <input
              value={form.company}
              onChange={updateField("company")}
              placeholder="Urbanly Hosts"
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
            {submitting ? "Creating owner account..." : "Create owner account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-fog">
          Already registered?{" "}
          <Link to="/owner/login" className="font-semibold text-emeraldDark">
            Use owner login
          </Link>
        </p>

        <p className="mt-3 text-center text-sm text-fog">
          Looking for a stay?{" "}
          <Link to="/register" className="font-semibold text-emeraldDark">
            Create customer account
          </Link>
        </p>
      </div>
    </div>
  );
}
