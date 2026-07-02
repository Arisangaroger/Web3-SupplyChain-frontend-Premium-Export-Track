import { EmptyStatePanel } from "@/components/ui/EmptyStatePanel";
import { DataValue } from "@/components/ui/typography";

interface Props {
  eyebrow: string;
  title: string;
  codeLabel: string;
  code: string;
  hint: string;
}

export function VerificationNotFound({ eyebrow, title, codeLabel, code, hint }: Props) {
  return (
    <div role="alert">
      <p className="eyebrow mb-3 text-slate-500">{eyebrow}</p>
      <EmptyStatePanel
        icon="chain"
        title={title}
        description={
          <>
            No {codeLabel} exists for{" "}
            <DataValue className="font-semibold text-forest">{code}</DataValue>. {hint}
          </>
        }
      />
    </div>
  );
}
