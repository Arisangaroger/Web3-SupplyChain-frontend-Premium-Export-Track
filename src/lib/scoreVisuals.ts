import { BRAND_AMBER } from "@/lib/brandAccent";

export function scoreRangeStyle(score: number): {
  fill: string;
  track: string;
  label: string;
  arc: string;
  bg: string;
} {
  if (score >= 80) {
    return {
      fill: "bg-forest",
      track: "bg-forest/15",
      label: "text-forest",
      arc: "#1b4332",
      bg: "bg-forest/5",
    };
  }
  if (score >= 60) {
    return {
      fill: "bg-amber",
      track: "bg-amber-100",
      label: "text-amber-800",
      arc: BRAND_AMBER.moderateArc,
      bg: "bg-amber-50",
    };
  }
  return {
    fill: "bg-orange-600/90",
    track: "bg-orange-100",
    label: "text-orange-800",
    arc: "#c2410c",
    bg: "bg-orange-50",
  };
}

export function gradeStyles(grade: string | null): {
  ring: string;
  text: string;
  bg: string;
  border: string;
} {
  switch (grade) {
    case "A":
      return {
        ring: "ring-amber/25",
        text: "text-amber-900",
        bg: "bg-amber-100",
        border: "border-amber-300",
      };
    case "B":
      return {
        ring: "ring-amber/15",
        text: "text-amber-800",
        bg: "bg-amber-50",
        border: "border-amber-200",
      };
    case "C":
      return {
        ring: "ring-forest/15",
        text: "text-forest",
        bg: "bg-forest/5",
        border: "border-forest/20",
      };
    case "D":
      return {
        ring: "ring-orange-200",
        text: "text-orange-900",
        bg: "bg-orange-50",
        border: "border-orange-300",
      };
    default:
      return {
        ring: "ring-red-200",
        text: "text-red-800",
        bg: "bg-red-50",
        border: "border-red-300",
      };
  }
}

export const SCORE_RANGE_LEGEND = [
  { label: "Strong", range: "80–100", className: "bg-forest" },
  { label: "Moderate", range: "60–79", className: "bg-amber" },
  { label: "At risk", range: "0–59", className: "bg-orange-600/90" },
] as const;
