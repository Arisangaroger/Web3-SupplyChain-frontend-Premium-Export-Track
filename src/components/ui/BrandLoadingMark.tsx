import { Leaf } from "lucide-react";
import { APP_NAME, APP_TAGLINE } from "@/lib/brand";

interface Props {
  message?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: {
    box: "h-12 w-12 rounded-xl",
    icon: "h-6 w-6",
    name: "text-[10px]",
    tagline: "text-[10px]",
  },
  md: {
    box: "h-16 w-16 rounded-2xl",
    icon: "h-8 w-8",
    name: "text-[11px]",
    tagline: "text-[10px]",
  },
  lg: {
    box: "h-20 w-20 rounded-2xl",
    icon: "h-10 w-10",
    name: "text-xs",
    tagline: "text-[11px]",
  },
};

export function BrandLoadingMark({ message, size = "lg" }: Props) {
  const styles = sizeClasses[size];

  return (
    <div className="flex flex-col items-center text-center" role="status" aria-live="polite">
      <div
        className={`flex shrink-0 items-center justify-center border border-forest/15 bg-white/90 shadow-sm ${styles.box}`}
      >
        <Leaf className={`leaf-pulse text-forest ${styles.icon}`} aria-hidden />
      </div>
      <p
        className={`mt-5 font-display font-semibold uppercase tracking-[0.22em] text-forest ${styles.name}`}
      >
        {APP_NAME}
      </p>
      <p className={`mt-1 uppercase tracking-[0.16em] text-slate-400 ${styles.tagline}`}>
        {message ?? APP_TAGLINE}
      </p>
    </div>
  );
}
