import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="flex items-center gap-2 font-heading text-lg font-bold tracking-tight text-ink">
            <img src="/logo.jpg" alt="Rift logo" className="h-6 w-6 rounded-lg object-cover" />
            Rift
          </p>
          <p className="mt-1 text-sm text-ink/60">
            Shared office space, only between trusted portfolio companies.
          </p>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium text-ink/70">
          <Link to="/" className="transition hover:text-ink">
            Home
          </Link>
          <Link to="/list" className="transition hover:text-ink">
            List Your Space
          </Link>
          <Link to="/find" className="transition hover:text-ink">
            Find a Space
          </Link>
        </div>
      </div>
      <div className="border-t border-border px-6 py-4 text-center text-xs text-ink/40">
        © {new Date().getFullYear()} Rift. Built for VC portfolio networks.
      </div>
    </footer>
  );
}
