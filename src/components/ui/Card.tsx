import { type ReactNode } from "react";

export type CardWeight = "primary" | "secondary" | "tertiary";

const shellByWeight: Record<CardWeight, string> = {
  primary: "surface-card-primary",
  secondary: "surface-card p-5",
  tertiary: "surface-card-tertiary",
};

const titleByWeight: Record<CardWeight, string> = {
  primary: "type-hero-display",
  secondary: "mb-4 font-display text-display-sm text-forest",
  tertiary: "mb-2 font-display text-xs font-semibold uppercase tracking-wider text-slate-500",
};

export function Card({
  title,
  children,
  className = "",
  weight = "secondary",
  badge,
  step,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
  weight?: CardWeight;
  /** Shown above the title on primary cards — e.g. "Current step" */
  badge?: string;
  /** Large step marker (A, B, 3…) for scannable workflow cards */
  step?: string;
}) {
  const showStepHeader = Boolean(title && step);

  return (
    <div className={`${shellByWeight[weight]} ${className}`}>
      {weight === "primary" && badge && !showStepHeader ? (
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-amber-800">
          {badge}
        </p>
      ) : null}
      {title && showStepHeader ? (
        <div className="mb-5 flex items-start gap-3 sm:gap-4">
          <span
            className="type-metric shrink-0 text-amber sm:text-6xl"
            aria-hidden
          >
            {step}
          </span>
          <div className="min-w-0 flex-1">
            {weight === "primary" && badge ? (
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-amber-800">
                {badge}
              </p>
            ) : null}
            <h2 className={titleByWeight[weight]}>{title}</h2>
          </div>
        </div>
      ) : title ? (
        <h2 className={`${titleByWeight[weight]} ${weight === "primary" ? "mb-5" : ""}`}>
          {title}
        </h2>
      ) : null}
      {children}
    </div>
  );
}
