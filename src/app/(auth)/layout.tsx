import Link from "next/link";
import { ShieldCheck, Lock, KeyRound, FileCheck2 } from "lucide-react";

const highlights = [
  {
    icon: ShieldCheck,
    title: "Security-first",
    body: "RBAC, hardened headers, and validated inputs by default.",
  },
  {
    icon: Lock,
    title: "Privacy by design",
    body: "Least-privilege access and a full activity audit trail.",
  },
  {
    icon: FileCheck2,
    title: "Enterprise-ready",
    body: "Accessible (WCAG AA), tested, and production-oriented.",
  },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand / value panel */}
      <div className="bg-primary text-primary-foreground relative hidden flex-col justify-between overflow-hidden p-10 lg:flex">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20 [background:radial-gradient(600px_circle_at_20%_10%,white,transparent_40%),radial-gradient(500px_circle_at_80%_80%,white,transparent_40%)]"
        />
        <Link
          href="/"
          className="relative flex items-center gap-2 font-semibold"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
            <ShieldCheck className="h-5 w-5" />
          </span>
          ClientPortal
        </Link>

        <div className="relative space-y-8">
          <div className="space-y-3">
            <h2 className="text-3xl leading-tight font-semibold">
              The secure home for your client relationships.
            </h2>
            <p className="text-primary-foreground/80 max-w-md">
              Projects, tickets, documents, billing and messaging — unified in
              one accessible, enterprise-grade portal.
            </p>
          </div>
          <ul className="space-y-4">
            {highlights.map((h) => (
              <li key={h.title} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
                  <h.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-medium">{h.title}</p>
                  <p className="text-primary-foreground/80 text-sm">{h.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-primary-foreground/70 relative flex items-center gap-2 text-xs">
          <KeyRound className="h-3.5 w-3.5" />
          Demo environment · no real data is stored
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
