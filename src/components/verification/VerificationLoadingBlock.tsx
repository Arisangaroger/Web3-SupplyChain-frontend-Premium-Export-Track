import { LoadingStatePanel } from "@/components/ui/LoadingStatePanel";

export function VerificationLoadingBlock(props: { label?: string }) {
  return <LoadingStatePanel label={props.label} />;
}
