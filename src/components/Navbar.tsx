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
    <div className="sticky top-0 z-50">
      <div className="h-1 w-full bg-gradient-to-r from-accentFrom via-accent to-accentTo" />
      <header
        className={`bg-ink transition-shadow ${scrolled ? "shadow-floating" : ""}`}
      >
        <nav className="flex w-full items-center justify-between gap-6 px-4 py-3.5 sm:px-6">
          <Link
            to="/"
            className="flex items-center gap-3 font-heading text-xl font-bold tracking-tight text-white"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white p-1.5 shadow-soft">
              <img
                src="/logo.jpg"
                alt="Rift logo"
                className="h-full w-full rounded-md object-cover"
              />
            </span>
            Rift
          </Link>
          <div className="flex items-center gap-5 text-base font-medium text-white/80 sm:gap-10">
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
                className="rounded-full bg-gradient-to-br from-accentFrom to-accentTo px-4 py-2 text-sm text-white transition hover:scale-105 hover:shadow-floating sm:px-5 sm:py-2.5 sm:text-base"
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
    </div>
  );
}
