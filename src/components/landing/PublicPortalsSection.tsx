"use client";

import Link from "next/link";
import { ArrowRight, Landmark, ScanLine, ShieldCheck } from "lucide-react";
import { PUBLIC_UTILITY_NAV } from "@/lib/publicNav";

const PORTAL_META: Record<
  (typeof PUBLIC_UTILITY_NAV)[number]["path"],
  {
    icon: typeof ScanLine;
    audience: string;
    highlight: string;
  }
> = {
  "/verify/lot/demo": {
    icon: ScanLine,
    audience: "Buyers & auditors",
    highlight: "Whole export batch",
  },
  "/verify/passport/demo": {
    icon: ShieldCheck,
    audience: "Importers & retailers",
    highlight: "Single sack trace",
  },
  "/dashboards/lender": {
    icon: Landmark,
    audience: "Lenders & financiers",
    highlight: "Farmer credit audit",
  },
};

const TRUST_STRIP = ["No account required", "Instant lookup", "Blockchain verified"];

export function PublicPortalsSection() {
  return (
    <section className="relative overflow-hidden border-y border-forest/10 bg-gradient-to-b from-white via-inset/40 to-canvas">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(27,67,50,0.06) 0%, transparent 45%), radial-gradient(circle at 80% 80%, rgba(212,163,115,0.08) 0%, transparent 40%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-forest/70">Open access</p>
          <h2 className="mt-2 text-display-md text-forest sm:text-3xl">
            Public verification portals
          </h2>
          <p className="lead mx-auto mt-4">
            Buyers, importers, lenders, and regulators can verify records immediately. Enter a code
            or scan a QR — compliance history and blockchain proofs in seconds.
          </p>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {PUBLIC_UTILITY_NAV.map(({ path, label, description }) => {
            const meta = PORTAL_META[path];
            const Icon = meta.icon;

            return (
              <li key={path}>
                <Link
                  href={path}
                  className="group flex h-full flex-col rounded-2xl border border-forest/10 bg-white/90 p-6 shadow-[0_1px_2px_rgba(27,67,50,0.04),0_8px_24px_rgba(27,67,50,0.06)] backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-forest/20 hover:shadow-[0_4px_12px_rgba(27,67,50,0.08),0_16px_40px_rgba(27,67,50,0.08)] sm:p-7"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-forest/[0.08] text-forest transition duration-300 group-hover:bg-forest/[0.12]">
                      <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-forest">
                      {meta.highlight}
                    </span>
                  </div>

                  <p className="mt-5 text-xs font-medium text-slate-500">{meta.audience}</p>
                  <h3 className="mt-1 text-lg font-semibold tracking-tight text-forest">{label}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{description}</p>

                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-forest transition group-hover:gap-2.5">
                    Open portal
                    <ArrowRight
                      className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {TRUST_STRIP.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-2 text-xs font-medium text-slate-500"
            >
              <span className="h-1 w-1 rounded-full bg-forest/40" aria-hidden />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
