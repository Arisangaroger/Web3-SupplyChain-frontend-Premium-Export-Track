import type { ReactNode } from "react";
import { BodyText } from "@/components/ui/typography";

export function FormErrorBanner({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 ${className}`.trim()}
      role="alert"
    >
      <BodyText className="text-red-700">{children}</BodyText>
    </div>
  );
}

export function FormSuccessBanner({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mt-3 rounded-lg border border-forest/15 bg-forest/5 px-3 py-2.5 ${className}`.trim()}
    >
      <BodyText className="font-medium text-forest">{children}</BodyText>
    </div>
  );
}
