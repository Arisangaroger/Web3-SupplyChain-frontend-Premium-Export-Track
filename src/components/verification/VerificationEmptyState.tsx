import { EmptyStatePanel } from "@/components/ui/EmptyStatePanel";

interface Props {
  title: string;
  description: string;
  icon?: "leaf" | "chain" | "search";
}

export function VerificationEmptyState({ title, description, icon = "search" }: Props) {
  return <EmptyStatePanel icon={icon} title={title} description={description} />;
}
