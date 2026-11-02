"use client";
import Link from "next/link";
import { Button, Card } from "@/components/shared/ui";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <Card className="placeholder-page" role="alert">
      <h1>We couldn’t display this page</h1>
      <p className="muted">Try again, or return to Trade.</p>
      <div className="flex flex-wrap gap-3">
        <Button onClick={reset}>Try again</Button>
        <Link className="button secondary" href="/trade">
          Go to Trade
        </Link>
      </div>
    </Card>
  );
}
