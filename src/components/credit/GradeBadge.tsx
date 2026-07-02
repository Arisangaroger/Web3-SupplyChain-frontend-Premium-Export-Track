import { DataValue } from "@/components/ui/typography";
import { gradeStyles } from "@/lib/scoreVisuals";

interface Props {
  grade: string | null;
  size?: "lg" | "sm";
}

export function GradeBadge({ grade, size = "lg" }: Props) {
  const styles = gradeStyles(grade);
  const display = grade ?? "—";

  if (size === "sm") {
    return (
      <span
        className={`inline-flex min-w-[2.25rem] items-center justify-center rounded-lg border px-2.5 py-1 font-display text-lg font-bold leading-none ${styles.bg} ${styles.border} ${styles.text}`}
      >
        {display}
      </span>
    );
  }

  return (
    <div
      className={`flex min-w-[5.5rem] flex-col items-center rounded-2xl border-2 px-5 py-3 shadow-sm ring-4 ${styles.bg} ${styles.border} ${styles.ring}`}
    >
      <span className="eyebrow text-slate-500">Grade</span>
      <span className={`font-display text-5xl font-bold leading-none ${styles.text}`}>
        {display}
      </span>
    </div>
  );
}
