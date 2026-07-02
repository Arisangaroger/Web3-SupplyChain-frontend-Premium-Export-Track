import { Leaf } from "lucide-react";
import { Eyebrow } from "@/components/ui/typography";

interface Props {
  title: string;
  eyebrow?: string;
  subtitle?: React.ReactNode;
}

export function BrandHeaderBlock({ title, eyebrow = "Premium Export Track", subtitle }: Props) {
  return (
    <div className="flex min-w-0 items-center gap-3 border-l-4 border-forest pl-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-forest/15 bg-white/80 shadow-sm">
        <Leaf className="h-5 w-5 text-forest" aria-hidden />
      </div>
      <div className="min-w-0">
        <Eyebrow className="text-slate-500">{eyebrow}</Eyebrow>
        <h1 className="truncate text-display-sm text-forest">{title}</h1>
        {subtitle ? <div className="mt-0.5 truncate text-xs text-slate-500">{subtitle}</div> : null}
      </div>
    </div>
  );
}
