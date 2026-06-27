import { ReactNode } from "react";

export default function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-3xl border border-border bg-white/90 p-8 shadow-floating backdrop-blur-md ${className}`}
    >
      {children}
    </div>
  );
}
