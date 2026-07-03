"use client";

import Link from "next/link";
import {
  Anchor,
  Droplets,
  Leaf,
  Package,
  Warehouse,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CoffeeHeroVisual } from "@/components/landing/CoffeeHeroVisual";
import { PublicPortalsSection } from "@/components/landing/PublicPortalsSection";
import { PublicSiteLayout } from "@/components/layout/PublicSiteLayout";
import { APP_NAME } from "@/lib/brand";
import { LOGIN_NAV } from "@/lib/publicNav";
import { STAGE_LABELS } from "@/lib/lifecycle";

const TRUST_PILLARS = [
  {
    title: "Farm location",
    description: "GPS from the farm is saved with each delivery.",
  },
  {
    title: "Fair pay checks",
    description: "See if farmers were paid at or above the living wage.",
  },
  {
    title: "Safe records",
    description: "Monthly data is stored on-chain so changes can be spotted.",
  },
];

export function LandingPage() {
  return (
    <PublicSiteLayout>
      <section className="relative overflow-hidden border-b border-forest/10 bg-[#0c2419] text-white">
        <div className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full bg-amber/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-72 w-72 rounded-full bg-forest-light/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-[65px] px-4 py-[89px] lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8 lg:py-[121px]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber/90">
              Rwanda · Coffee
            </p>
            <h1 className="mt-4 max-w-2xl font-display text-display-lg text-white lg:text-5xl">
              Track every sack from farm to buyer
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70">
              {APP_NAME} links washing stations, exporters, warehouses, and ports. Anyone can check
              a sack or lot online — no account needed.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/verify/passport/demo">
                <Button variant="secondary" className="px-5 py-2.5">
                  Check a passport
                </Button>
              </Link>
              <Link href={LOGIN_NAV.path}>
                <Button className="border border-white/20 bg-white/10 px-5 py-2.5 text-white hover:bg-white/15">
                  Sign in
                </Button>
              </Link>
            </div>
          </div>

          <CoffeeHeroVisual />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <p className="eyebrow text-forest/70">Why use it</p>
          <h2 className="mt-2 font-display text-display-md text-forest">
            Clear records at every step
          </h2>
          <p className="lead mt-3">
            Staff run the day-to-day work. Buyers and auditors use open pages to verify sacks and
            lots.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {TRUST_PILLARS.map((pillar) => (
            <article key={pillar.title} className="surface-card p-6">
              <h3 className="font-display text-display-sm text-forest">{pillar.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{pillar.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-forest/10 bg-white/60">
        <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <p className="eyebrow text-forest/70">How it works</p>
            <h2 className="mt-2 font-display text-display-md text-forest">Five simple steps</h2>
            <p className="lead mt-3">
              Staff scan tracking codes as coffee moves. Buyers get a public passport at export.
            </p>
          </div>

          <ol className="mt-10 grid gap-4 lg:grid-cols-5">
            {[
              { icon: Leaf, label: STAGE_LABELS.AT_FARM },
              { icon: Droplets, label: STAGE_LABELS.AT_WASHING_STATION },
              { icon: Package, label: STAGE_LABELS.AT_EXPORT_LOT },
              { icon: Warehouse, label: STAGE_LABELS.AT_WAREHOUSE },
              { icon: Anchor, label: STAGE_LABELS.PORT_LOCKED },
            ].map(({ icon: Icon, label }, index) => (
              <li key={label} className="surface-card flex flex-col p-5">
                <span className="font-data text-xs font-semibold text-amber-800">
                  Step {index + 1}
                </span>
                <span className="mt-3 flex h-10 w-10 items-center justify-center rounded-lg border border-forest/10 bg-inset text-forest">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <p className="mt-4 text-sm font-medium leading-snug text-slate-700">{label}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <PublicPortalsSection />

      <section className="border-t border-forest/10 bg-[#0f2e22] text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-12 lg:flex-row lg:items-center lg:px-8 lg:py-14">
          <div>
            <p className="eyebrow text-white/45">For staff</p>
            <h2 className="mt-2 font-display text-display-md text-white">Work on the supply chain?</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/65">
              Sign in to log cherry intake, scan sacks, issue buyer passports, and run monthly
              rollups.
            </p>
          </div>
          <Link href={LOGIN_NAV.path}>
            <Button variant="secondary" className="px-6 py-2.5">
              Sign in
            </Button>
          </Link>
        </div>
      </section>
    </PublicSiteLayout>
  );
}
