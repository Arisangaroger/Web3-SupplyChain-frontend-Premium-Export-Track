import type { ReactNode } from "react";
import {
  History,
  Leaf,
  Link2,
  Package,
  Search,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";

export type EmptyStateIcon = "leaf" | "chain" | "history" | "package" | "search" | "shield";

const ICONS: Record<EmptyStateIcon, LucideIcon> = {
  leaf: Leaf,
  chain: Link2,
  history: History,
  package: Package,
  search: Search,
  shield: ShieldAlert,
};

interface Props {
  icon?: EmptyStateIcon;
  title: string;
  description: ReactNode;
  action?: ReactNode;
  compact?: boolean;
}

export function EmptyStatePanel({
  icon = "leaf",
  title,
  description,
  action,
  compact = false,
}: Props) {
  const Icon = ICONS[icon];
  const padding = compact ? "px-5 py-8" : "px-6 py-12 sm:py-14";
  const iconBox = compact ? "h-14 w-14 rounded-xl" : "h-16 w-16 rounded-2xl";
  const iconSize = compact ? "h-7 w-7" : "h-8 w-8";

  return (
    <div className={`surface-placeholder text-center ${padding}`}>
      <div
        className={`mx-auto flex items-center justify-center border border-forest/10 bg-white/70 shadow-sm ${iconBox}`}
      >
        <Icon className={`${iconSize} text-forest/50`} strokeWidth={1.5} aria-hidden />
      </div>
      <h3 className={`mt-5 text-forest ${compact ? "text-display-sm" : "text-display-md"}`}>
        {title}
      </h3>
      <p className="type-body mx-auto mt-2 max-w-md text-slate-600">{description}</p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
