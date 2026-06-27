import { Link } from "react-router-dom";
import FaqAccordion from "../components/FaqAccordion";

const valueProps = [
  {
    title: "Hosts",
    description:
      "Recover sunk lease costs on the office you signed for in 2021 and aren't fully using. List your unused desks, floors, or boardrooms and turn fixed overhead into recurring revenue.",
  },
  {
    title: "Guests",
    description:
      "Book trusted space in minutes — no broker calls, no cold leasing, no liability surprises. Every space on Nexus belongs to a company backed by your own fund.",
  },
  {
    title: "Networks",
    description:
      "Reduce aggregate portfolio burn by turning empty square footage into a shared resource. Funds that roll this out see real estate spend drop across every company at once.",
  },
];

const investors = ["a16z", "Sequoia", "YC", "Accel", "General Catalyst"];

export default function Home() {
  return (
    <div>
      <section className="mx-auto max-w-5xl px-6 py-24 text-center sm:py-32">
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
          Your portfolio company has{" "}
          <span className="text-accent">40% empty</span> office space.
          <br />
          Turn it into runway.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/60">
          Nexus connects companies in the same VC portfolio to share unused
          office space — pre-vetted, pre-trusted, zero cold outreach.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/list"
            className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:scale-105 hover:shadow-[0_0_24px_rgba(99,102,241,0.55)]"
          >
            List Your Space
          </Link>
          <Link
            to="/book"
            className="rounded-full border border-border px-6 py-3 text-sm font-semibold text-white transition hover:scale-105 hover:border-white/30"
          >
            Find a Space
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-6 sm:grid-cols-3">
          {valueProps.map((prop) => (
            <div
              key={prop.title}
              className="rounded-2xl border border-border bg-white/5 p-8 backdrop-blur-sm"
            >
              <h3 className="text-lg font-semibold text-accent">
                {prop.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-white/40">
          Built for portfolio companies backed by
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {investors.map((investor) => (
            <span
              key={investor}
              className="text-lg font-semibold text-white/30"
            >
              {investor}
            </span>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">
          Frequently asked questions
        </h2>
        <div className="mt-10">
          <FaqAccordion />
        </div>
      </section>
    </div>
  );
}
