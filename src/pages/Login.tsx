import { useState } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/profile";

  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await api.post("/auth/login", {
        email: email.trim(),
        password,
      });

      login(res.data.user, res.data.token);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Login failed");
      } else {
        setError("Login failed");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero-grid bg-hero-grid px-4 py-10">
      <div className="mx-auto max-w-md rounded-[28px] border border-white/70 bg-white/90 p-8 shadow-float backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emeraldAccent">
          Urbanly
        </p>
        <h1 className="mt-3 font-display text-3xl text-emeraldDark">Welcome back</h1>
        <p className="mt-2 text-sm text-fog">
          Sign in to continue exploring stays and manage your shortlist.
        </p>

        <div className="mt-8 space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-inkSlate">Email</span>
            <input
              value={email}
              placeholder="you@example.com"
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
          {submitting ? "Signing in..." : "Login"}
        </button>

        <p className="mt-6 text-center text-sm text-fog">
          New here?{" "}
          <Link to="/register" className="font-semibold text-emeraldDark">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
