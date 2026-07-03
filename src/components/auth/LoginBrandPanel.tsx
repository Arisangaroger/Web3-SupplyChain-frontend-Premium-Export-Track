import { Leaf } from "lucide-react";
import { APP_NAME, APP_TAGLINE } from "@/lib/brand";

const HIGHLIGHTS = [
  "From cherry intake to port",
  "GPS location on each step",
  "Public check pages for buyers and lenders",
];

export function LoginBrandPanel() {
  return (
    <div className="relative flex min-h-[36vh] flex-col justify-center overflow-hidden bg-[#0c2419] px-8 py-12 text-white lg:min-h-0 lg:w-[48%] lg:px-14 lg:py-16">
      <div className="pointer-events-none absolute -right-24 top-1/4 h-72 w-72 rounded-full bg-amber/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-forest-light/15 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-md">
        <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5">
          <Leaf className="h-6 w-6 text-amber" aria-hidden />
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber/90">
          Rwanda · Coffee
        </p>
        <h1 className="mt-3 font-display text-display-lg text-white lg:text-4xl">{APP_NAME}</h1>
        <p className="mt-3 max-w-sm text-sm text-white/65">{APP_TAGLINE}</p>

        <ul className="mt-8 space-y-3 border-t border-white/10 pt-8">
          {HIGHLIGHTS.map((line) => (
            <li key={line} className="flex items-start gap-3 text-sm text-white/75">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" aria-hidden />
              {line}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
