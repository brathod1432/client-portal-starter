import Link from "next/link";
import { Compass } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <span className="bg-muted text-muted-foreground flex h-12 w-12 items-center justify-center rounded-full">
        <Compass className="h-6 w-6" />
      </span>
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold">404</h1>
        <p className="text-muted-foreground max-w-md text-sm">
          We couldn&apos;t find the page you&apos;re looking for. It may have
          been moved or no longer exists.
        </p>
      </div>
      <Button asChild>
        <Link href="/dashboard">Back to dashboard</Link>
      </Button>
    </div>
  );
}
