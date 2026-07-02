import { type ReactNode } from "react";

export function SurfaceInset({
  children,
  className = "",
  padding = true,
}: {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}) {
  return (
    <div className={`surface-inset ${padding ? "p-3" : ""} ${className}`}>{children}</div>
  );
}
