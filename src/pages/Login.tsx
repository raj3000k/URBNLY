import { useState } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import BrandLogo from "../components/BrandLogo";
import LoadingButton from "../components/LoadingButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/interested";

  if (user) {
    return <Navigate to={user.role === "owner" ? "/dashboard" : redirectTo} replace />;
  }

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const customerRes = await api.post("/auth/customer/login", {
        email: email.trim(),
        password,
      });

      login(customerRes.data.user, customerRes.data.token);
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
    <div className="page-enter min-h-screen overflow-x-hidden bg-hero-grid bg-hero-grid px-3 py-6 sm:px-4 sm:py-10">
      <div className="mx-auto max-w-md rounded-[24px] border border-white/70 bg-white/90 p-5 shadow-float backdrop-blur sm:rounded-[28px] sm:p-8">
        <BrandLogo subtitle="Customer workspace" />
        <h1 className="mt-3 font-display text-3xl text-emeraldDark">Welcome back</h1>
        <p className="mt-2 text-sm text-fog">
          Sign in as a customer to continue into your stay search workspace.
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

        {submitting && (
          <div className="mt-4 rounded-2xl border border-emeraldAccent/20 bg-emeraldAccent/10 px-4 py-3 text-sm text-emeraldDark">
            Warming up your workspace and syncing saved stays. This can take a few
            seconds on the free backend.
          </div>
        )}

        <LoadingButton
          onClick={handleLogin}
          loading={submitting}
          loadingText="Opening your workspace..."
          className="mt-6 w-full"
        >
          Login
        </LoadingButton>

        <p className="mt-6 text-center text-sm text-fog">
          New here?{" "}
          <Link to="/register" className="font-semibold text-emeraldDark">
            Create an account
          </Link>
        </p>

        <p className="mt-3 text-center text-sm text-fog">
          Listing a property?{" "}
          <Link to="/owner/login" className="font-semibold text-emeraldDark">
            Use owner login
          </Link>
        </p>
      </div>
    </div>
  );
}
