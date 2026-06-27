import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loadAuth, logout } from "./AuthGate";
import { AUTH_CHANGE_EVENT, AuthSession } from "../types";

export default function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [auth, setAuth] = useState<AuthSession | null>(loadAuth);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function refresh() {
      setAuth(loadAuth());
    }
    window.addEventListener(AUTH_CHANGE_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-colors ${
        scrolled
          ? "border-b border-border bg-background/70 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-lg font-bold tracking-tight">
          Nexus
        </Link>
        <div className="flex items-center gap-3 text-sm font-medium text-white/80 sm:gap-8">
          <Link to="/" className="hidden transition hover:text-white sm:inline">
            Home
          </Link>

          {auth?.role !== "guest" && (
            <Link to="/list" className="transition hover:text-white">
              List
            </Link>
          )}

          {auth?.role === "guest" && (
            <Link
              to="/dashboard/guest"
              className="hidden transition hover:text-white sm:inline"
            >
              My Bookings
            </Link>
          )}

          {auth?.role === "host" && (
            <Link
              to="/dashboard/host"
              className="hidden transition hover:text-white sm:inline"
            >
              Host Dashboard
            </Link>
          )}

          {auth?.role !== "host" && (
            <Link
              to="/find"
              className="rounded-full bg-accent px-3 py-1.5 text-xs text-white transition hover:scale-105 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] sm:px-4 sm:py-2 sm:text-sm"
            >
              Find a Space
            </Link>
          )}

          {auth && (
            <button
              type="button"
              onClick={handleLogout}
              className="transition hover:text-white"
            >
              Log out
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
