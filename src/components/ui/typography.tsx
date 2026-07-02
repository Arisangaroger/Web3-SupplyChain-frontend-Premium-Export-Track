import type { ReactNode } from "react";

/** 12px — field labels, captions, metadata */
export function TypeLabel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={`type-label ${className}`.trim()}>{children}</p>;
}

/** 14px — default dashboard / form body copy */
export function BodyText({
  children,
  className = "",
  muted = false,
}: {
  children: ReactNode;
  className?: string;
  muted?: boolean;
}) {
  return (
    <p className={`type-body ${muted ? "text-slate-600" : ""} ${className}`.trim()}>
      {children}
    </p>
  );
}

export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={`eyebrow ${className}`.trim()}>{children}</p>;
}

type MetricSize = "lg" | "xl";

/** 48–72px tabular hero figure — one dominant number per screen */
export function HeroMetric({
  children,
  size = "lg",
  className = "",
}: {
  children: ReactNode;
  size?: MetricSize;
  className?: string;
}) {
  return (
    <span
      className={`${size === "xl" ? "type-metric-xl" : "type-metric"} ${className}`.trim()}
    >
      {children}
    </span>
  );
}

/** Label + hero number strip for dashboard page headers */
export function DashboardHeroStrip({
  label,
  value,
  unit,
  sublabel,
  className = "",
  valueClassName = "",
}: {
  label: string;
  value: ReactNode;
  unit?: string;
  sublabel?: string;
  className?: string;
  valueClassName?: string;
}) {
  return (
    <div
      className={`mb-6 border-b border-forest/10 pb-6 ${className}`.trim()}
      aria-label={typeof value === "string" || typeof value === "number" ? `${label}: ${value}` : label}
    >
      <p className="eyebrow text-slate-500">{label}</p>
      <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <HeroMetric size="xl" className={valueClassName}>
          {value}
        </HeroMetric>
        {unit ? (
          <span className="type-body font-medium text-slate-500">{unit}</span>
        ) : null}
      </div>
      {sublabel ? <TypeLabel className="mt-2">{sublabel}</TypeLabel> : null}
    </div>
  );
}

type DataSize = "xs" | "sm" | "md" | "lg" | "hero" | "metric" | "terminal";

const DATA_SIZE_CLASSES: Record<DataSize, string> = {
  xs: "text-[11px]",
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  hero: "text-5xl font-bold leading-none",
  metric: "text-5xl font-bold leading-none sm:text-6xl",
  terminal: "text-6xl font-bold leading-none sm:text-[4.5rem]",
};

/** Machine-readable values: scores, IDs, codes, coordinates, weights, dates. */
export function DataValue({
  children,
  className = "",
  size = "md",
}: {
  children: ReactNode;
  className?: string;
  size?: DataSize;
}) {
  return (
    <span className={`font-data tabular-nums ${DATA_SIZE_CLASSES[size]} ${className}`.trim()}>
      {children}
    </span>
  );
}

/** Block-level data (table cells, GPS lines, merkle roots). */
export function DataBlock({
  children,
  className = "",
  size = "sm",
}: {
  children: ReactNode;
  className?: string;
  size?: DataSize;
}) {
  return (
    <span
      className={`font-data block break-all tabular-nums ${DATA_SIZE_CLASSES[size]} ${className}`.trim()}
    >
      {children}
    </span>
  );
}

/** Form fields for tracking codes, lot codes, farmer IDs, periods. */
export function dataFieldClassName(className = "") {
  return `font-data tracking-tight ${className}`.trim();
}

/** Label + monospace textarea for lot codes, merge lists, etc. */
export function DataTextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}) {
  return (
    <label className="block">
      <span className="eyebrow text-slate-600">{label}</span>
      <textarea
        className={dataFieldClassName(
          `type-body mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-forest focus:ring-2 focus:ring-forest/20 ${className}`,
        )}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
