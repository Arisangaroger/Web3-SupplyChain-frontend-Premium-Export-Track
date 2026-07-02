import { BrandLoadingMark } from "@/components/ui/BrandLoadingMark";

interface Props {
  message?: string;
  fullScreen?: boolean;
}

export function AppLoadingScreen({ message, fullScreen = true }: Props) {
  const shell = fullScreen
    ? "flex min-h-screen items-center justify-center bg-canvas px-4"
    : "flex items-center justify-center px-4 py-12";

  return (
    <div className={shell}>
      <BrandLoadingMark message={message} size="lg" />
    </div>
  );
}
