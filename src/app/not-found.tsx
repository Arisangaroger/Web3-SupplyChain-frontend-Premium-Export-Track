import Link from "next/link";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";
import { Button } from "@/components/ui/Button";
import { EmptyStatePanel } from "@/components/ui/EmptyStatePanel";

export default function NotFound() {
  return (
    <PublicPageLayout title="Page not found" subtitle="The requested route does not exist" maxWidth="4xl">
      <EmptyStatePanel
        icon="search"
        title="This page could not be found"
        description="The link may be wrong or out of date. Go home or open a public check page."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/">
              <Button>Back to home</Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link href="/verify/passport/demo">
              <Button variant="secondary">Verify passport</Button>
            </Link>
          </div>
        }
      />
    </PublicPageLayout>
  );
}
