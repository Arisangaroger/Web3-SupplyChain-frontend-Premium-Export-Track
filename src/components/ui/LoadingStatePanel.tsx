import { BrandLoadingMark } from "@/components/ui/BrandLoadingMark";

interface Props {
  label?: string;
}

/** In-page loading — e.g. verification fetch, audit in progress */
export function LoadingStatePanel({ label = "Loading…" }: Props) {
  return (
    <div className="surface-card overflow-hidden p-8 sm:p-10" role="status" aria-live="polite">
      <div className="mx-auto max-w-md">
        <BrandLoadingMark message={label} size="md" />
        <div className="mt-8 space-y-3 animate-pulse" aria-hidden>
          <div className="h-3 rounded-full bg-inset" />
          <div className="h-3 w-4/5 rounded-full bg-inset" />
          <div className="grid gap-3 pt-2 sm:grid-cols-2">
            <div className="h-24 rounded-xl bg-inset/80" />
            <div className="h-24 rounded-xl bg-inset/80" />
          </div>
        </div>
      </div>
    </div>
  );
}
