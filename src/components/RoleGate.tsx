import { Link } from "react-router-dom";
import Panel from "./Panel";
import { UserRole } from "../types";

export default function RoleGate({
  requiredRole,
  redirectTo,
  redirectLabel,
}: {
  requiredRole: UserRole;
  redirectTo: string;
  redirectLabel: string;
}) {
  const otherRole = requiredRole === "host" ? "guest" : "host";

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <Panel className="text-center">
        <h1 className="text-xl font-bold">
          This area is for {requiredRole}s
        </h1>
        <p className="mt-2 text-sm text-white/60">
          You're signed in as a {otherRole}. Log out from the navbar to
          switch roles, or head to the right place for you.
        </p>
        <Link
          to={redirectTo}
          className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:scale-105 hover:shadow-[0_0_24px_rgba(99,102,241,0.55)]"
        >
          {redirectLabel}
        </Link>
      </Panel>
    </div>
  );
}
