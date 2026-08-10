import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";

/** Portal wordmark. Swap for a client logo when white-labelling. */
export function Brand({ className }: { className?: string }) {
  return (
    <Link
      href="/dashboard"
      className={cn(
        "focus-visible:ring-ring flex items-center gap-2 rounded-md font-semibold tracking-tight focus-visible:ring-2 focus-visible:outline-none",
        className,
      )}
    >
      <span className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg">
        <ShieldCheck className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="text-base">
        Client<span className="text-primary">Portal</span>
      </span>
    </Link>
  );
}
