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
      className={`rounded-2xl border border-border bg-white/5 p-8 backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}
