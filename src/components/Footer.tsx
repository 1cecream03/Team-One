import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-bold tracking-tight">Nexus</p>
          <p className="mt-1 text-sm text-white/60">
            Shared office space, only between trusted portfolio companies.
          </p>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium text-white/80">
          <Link to="/" className="transition hover:text-white">
            Home
          </Link>
          <Link to="/list" className="transition hover:text-white">
            List Your Space
          </Link>
          <Link to="/find" className="transition hover:text-white">
            Find a Space
          </Link>
        </div>
      </div>
      <div className="border-t border-border px-6 py-4 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Nexus. Built for VC portfolio networks.
      </div>
    </footer>
  );
}
