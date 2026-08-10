"use client";

import * as React from "react";
import {
  Scale,
  HeartPulse,
  Truck,
  Landmark,
  Shield,
  Briefcase,
  Building2,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Vertical {
  icon: LucideIcon;
  name: string;
  tagline: string;
  accent: string;
  modules: string[];
  customization: string;
  value: string;
}

const verticals: Vertical[] = [
  {
    icon: Scale,
    name: "Legal Firm Portal",
    tagline: "Matters, filings & secure client collaboration",
    accent: "from-indigo-500/15 to-indigo-500/0 text-indigo-600",
    modules: [
      "Matters (Projects)",
      "Case documents",
      "Retainer invoices",
      "Secure messaging",
    ],
    customization:
      "Rename Projects → Matters, Tickets → Requests. Add matter numbers, conflict checks and privileged-document watermarks.",
    value:
      "Reduces email back-and-forth, provides an auditable client record, and reinforces confidentiality expectations.",
  },
  {
    icon: HeartPulse,
    name: "Healthcare Portal",
    tagline: "Care plans, records & appointments",
    accent: "from-emerald-500/15 to-emerald-500/0 text-emerald-600",
    modules: [
      "Care plans",
      "Records (Documents)",
      "Billing",
      "Provider messaging",
    ],
    customization:
      "Add HIPAA-aligned consent flows, appointment scheduling and PHI access controls layered on the RBAC model.",
    value:
      "Improves patient engagement and transparency while keeping sensitive records access-controlled and audited.",
  },
  {
    icon: Truck,
    name: "Logistics Portal",
    tagline: "Shipments, tracking & proof of delivery",
    accent: "from-amber-500/15 to-amber-500/0 text-amber-600",
    modules: [
      "Shipments (Projects)",
      "PODs (Documents)",
      "Freight invoices",
      "Exceptions (Tickets)",
    ],
    customization:
      "Swap progress bars for shipment milestones, add live tracking maps and SLA breach alerts.",
    value:
      "Gives customers self-service visibility, cutting 'where is my order?' calls and speeding dispute resolution.",
  },
  {
    icon: Landmark,
    name: "Financial Portal",
    tagline: "Portfolios, statements & advisory",
    accent: "from-sky-500/15 to-sky-500/0 text-sky-600",
    modules: [
      "Holdings (Dashboard)",
      "Statements",
      "Fees (Invoices)",
      "Advisor messaging",
    ],
    customization:
      "Add portfolio performance charts, document e-signatures and step-up authentication for transfers.",
    value:
      "Builds trust through transparency and provides a compliant, branded channel for advisor communication.",
  },
  {
    icon: Shield,
    name: "Insurance Portal",
    tagline: "Policies, claims & documents",
    accent: "from-rose-500/15 to-rose-500/0 text-rose-600",
    modules: [
      "Policies (Projects)",
      "Claims (Tickets)",
      "Policy docs",
      "Premium invoices",
    ],
    customization:
      "Model claims as a ticket workflow with adjuster assignment, add coverage summaries and renewal reminders.",
    value:
      "Accelerates claims intake and status transparency, improving retention and reducing call-center load.",
  },
  {
    icon: Briefcase,
    name: "Consulting Portal",
    tagline: "Engagements, deliverables & billing",
    accent: "from-violet-500/15 to-violet-500/0 text-violet-600",
    modules: [
      "Engagements (Projects)",
      "Deliverables",
      "Retainers (Invoices)",
      "Advisory (Messages)",
    ],
    customization:
      "Highlight milestone deliverables, time-and-materials tracking and executive summary dashboards.",
    value:
      "Positions the firm as organized and premium; clients always know status, spend and next steps.",
  },
  {
    icon: Building2,
    name: "Property Management Portal",
    tagline: "Units, maintenance & rent",
    accent: "from-teal-500/15 to-teal-500/0 text-teal-600",
    modules: [
      "Units (Projects)",
      "Maintenance (Tickets)",
      "Leases (Documents)",
      "Rent (Invoices)",
    ],
    customization:
      "Add maintenance photo uploads, recurring rent invoices and per-tenant document sharing.",
    value:
      "Streamlines maintenance requests and rent collection while giving tenants a modern self-service experience.",
  },
  {
    icon: GraduationCap,
    name: "Education Portal",
    tagline: "Programs, resources & tuition",
    accent: "from-fuchsia-500/15 to-fuchsia-500/0 text-fuchsia-600",
    modules: [
      "Programs (Projects)",
      "Resources (Documents)",
      "Tuition (Invoices)",
      "Advisor messaging",
    ],
    customization:
      "Add enrollment progress, gradebook widgets and parent/guardian delegated access.",
    value:
      "Centralizes the student/parent experience and reduces administrative overhead for staff.",
  },
];

export default function ShowcasePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Showcase"
        description="One codebase, many industries. See how the portal adapts."
      />

      <Card className="border-primary/20 from-primary/5 overflow-hidden bg-gradient-to-br to-transparent">
        <CardContent className="p-6">
          <Badge variant="secondary" className="mb-3">
            Sales demonstration
          </Badge>
          <h2 className="max-w-2xl text-xl font-semibold">
            The same secure, accessible foundation — retheme the tokens, rename
            the modules, and ship a tailored portal in days, not months.
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
            Every vertical below reuses the identical RBAC model, security
            posture, design system and component library. Only content,
            terminology and accent colors change.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {verticals.map((v) => {
          const Icon = v.icon;
          return (
            <Card key={v.name} className="flex flex-col">
              <CardHeader>
                <div
                  className={`mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${v.accent}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle>{v.name}</CardTitle>
                <CardDescription>{v.tagline}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-4">
                <div className="flex flex-wrap gap-1.5">
                  {v.modules.map((m) => (
                    <Badge key={m} variant="outline" className="font-normal">
                      {m}
                    </Badge>
                  ))}
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                    Customization
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {v.customization}
                  </p>
                </div>
                <div className="bg-muted/50 mt-auto rounded-lg p-3">
                  <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                    Business value
                  </p>
                  <p className="mt-1 text-sm">{v.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
