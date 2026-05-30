import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  CalendarDays,
  Heart,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Sparkles,
  UserCircle2,
  X,
} from "lucide-react";
import BrandLogo from "./BrandLogo";
import { useAuth } from "../context/AuthContext";

const customerItems = [
  { to: "/home", label: "Explore", icon: Search },
  { to: "/interested", label: "Interested", icon: Sparkles },
  { to: "/saved", label: "Saved", icon: Heart },
  { to: "/visits", label: "Visits", icon: CalendarDays },
];

const ownerItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/", label: "Public site", icon: Home },
];

export default function UserNav() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) {
    return null;
  }

  const items = user.role === "owner" ? ownerItems : customerItems;

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `inline-flex items-center justify-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold transition ${
      isActive
        ? "bg-emeraldDark text-white shadow-sm"
        : "border border-emeraldDark/10 bg-white/70 text-emeraldDark hover:bg-mintMist"
    }`;

  return (
    <header className="sticky top-3 z-40 rounded-[24px] border border-white/70 bg-white/90 p-3 shadow-float backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <Link to={user.role === "owner" ? "/dashboard" : "/home"} className="min-w-0">
          <BrandLogo subtitle={user.role === "owner" ? "Owner portal" : "Customer workspace"} />
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={navLinkClass}>
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
          <NavLink to="/profile" className={navLinkClass}>
            <UserCircle2 size={16} />
            {user.name.split(" ")[0]}
          </NavLink>
          <button
            onClick={logout}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
          >
            <LogOut size={16} />
            Logout
          </button>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-emeraldDark/10 bg-white text-emeraldDark shadow-sm lg:hidden"
          aria-label={open ? "Close navigation" : "Open navigation"}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="mt-3 grid gap-2 rounded-[20px] border border-emeraldDark/10 bg-mintMist/80 p-2 lg:hidden">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={navLinkClass}
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
          <NavLink
            to="/profile"
            onClick={() => setOpen(false)}
            className={navLinkClass}
          >
            <UserCircle2 size={16} />
            {user.name.split(" ")[0]}
          </NavLink>
          <button
            onClick={() => {
              setOpen(false);
              logout();
            }}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-white px-3 py-3 text-sm font-semibold text-red-600"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
