import Link from "next/link";
import { Card } from "@/components/shared/ui";

export default function NotFound() {
  return (
    <Card className="placeholder-page">
      <h1>Page not found</h1>
      <p className="muted">
        This page doesn’t exist. Continue to your trading workspace.
      </p>
      <Link className="button primary" href="/trade">
        Go to Trade
      </Link>
    </Card>
  );
}
