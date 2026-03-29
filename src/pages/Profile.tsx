import { Link, Navigate } from "react-router-dom";
import { LogOut, Mail, UserCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

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
                  User ID
                </p>
                <p className="mt-2 text-lg font-semibold text-inkSlate">{user.id}</p>
              </div>
              <div className="rounded-3xl bg-mintMist p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-fog">
                  Session
                </p>
                <p className="mt-2 text-lg font-semibold text-inkSlate">
                  Persisted locally
                </p>
              </div>
            </div>
          </section>

          <aside className="rounded-[28px] border border-emeraldDark/10 bg-emeraldDark p-6 text-white shadow-float">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emeraldSoft">
              Next up
            </p>
            <h2 className="mt-3 font-display text-2xl">Saved stays and owner tools</h2>
            <p className="mt-3 text-sm leading-6 text-emeraldSoft/90">
              Your account layer is now ready for wishlist, booking, and dashboard
              flows. This page will become the anchor for those product features.
            </p>
            <div className="mt-6 space-y-3">
              <Link
                to="/"
                className="block rounded-2xl bg-white px-4 py-3 text-center font-semibold text-emeraldDark transition hover:bg-sandstone"
              >
                Explore properties
              </Link>
              <Link
                to="/register"
                className="block rounded-2xl border border-white/20 px-4 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Create another test account
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
