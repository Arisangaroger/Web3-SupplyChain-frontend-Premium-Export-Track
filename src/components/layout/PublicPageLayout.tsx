"use client";

import { PublicSiteLayout } from "@/components/layout/PublicSiteLayout";

const WIDTH_CLASS = {
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "6xl": "max-w-6xl",
} as const;

interface Props {
  title: string;
  subtitle?: string;
  maxWidth?: keyof typeof WIDTH_CLASS;
  children: React.ReactNode;
}

export function PublicPageLayout({
  title,
  subtitle,
  maxWidth = "3xl",
  children,
}: Props) {
  return (
    <PublicSiteLayout>
      <div className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-8 lg:py-10">
        <header className="mb-8 border-b border-forest/10 pb-6">
          <h1 className="font-display text-display-sm text-forest sm:text-display-md">{title}</h1>
          {subtitle ? <p className="mt-2 text-sm text-slate-500 sm:text-base">{subtitle}</p> : null}
        </header>

        <main className={`mx-auto w-full ${WIDTH_CLASS[maxWidth]} space-y-6 type-body`}>
          {children}
        </main>
      </div>
    </PublicSiteLayout>
  );
}
