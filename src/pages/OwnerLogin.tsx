import { useState } from "react";
import axios from "axios";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function OwnerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/dashboard";

  if (user?.role === "owner") {
    return <Navigate to={redirectTo} replace />;
  }

  if (user?.role === "customer") {
    return <Navigate to="/interested" replace />;
  }

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await api.post("/auth/owner/login", {
        email: email.trim(),
        password,
      });

      login(response.data.user, response.data.token);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Owner login failed");
      } else {
        setError("Owner login failed");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero-grid bg-hero-grid px-4 py-10">
      <div className="mx-auto max-w-md rounded-[28px] border border-white/70 bg-white/90 p-8 shadow-float backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emeraldAccent">
          URBNLY OWNER
        </p>
        <h1 className="mt-3 font-display text-3xl text-emeraldDark">Owner portal</h1>
        <p className="mt-2 text-sm text-fog">
          Sign in to manage listings, review visit requests, and keep inventory live.
        </p>

        <div className="mt-8 space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-inkSlate">Owner email</span>
            <input
              value={email}
              placeholder="host@example.com"
              className="w-full rounded-2xl border border-emeraldDark/10 bg-white px-4 py-3 outline-none transition focus:border-emeraldAccent focus:ring-4 focus:ring-emeraldAccent/10"
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-inkSlate">Password</span>
            <input
              value={password}
              placeholder="Enter your password"
              type="password"
              className="w-full rounded-2xl border border-emeraldDark/10 bg-white px-4 py-3 outline-none transition focus:border-emeraldAccent focus:ring-4 focus:ring-emeraldAccent/10"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>

        {error && (
          <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          onClick={handleLogin}
          disabled={submitting}
          className="mt-6 w-full rounded-2xl bg-emeraldDark px-4 py-3 font-semibold text-white transition hover:bg-emeraldAccent disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? "Signing in..." : "Enter owner portal"}
        </button>

        <p className="mt-6 text-center text-sm text-fog">
          Looking for a stay?{" "}
          <Link to="/login" className="font-semibold text-emeraldDark">
            Use customer login
          </Link>
        </p>
      </div>
    </div>
  );
}
