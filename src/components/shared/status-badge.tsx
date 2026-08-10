import { Badge, type BadgeProps } from "@/components/ui/badge";

type Variant = NonNullable<BadgeProps["variant"]>;

interface StatusMeta {
  label: string;
  variant: Variant;
}

/** Central mapping of domain statuses -> presentation, so colors stay consistent. */
const STATUS_MAP: Record<string, StatusMeta> = {
  // Tickets
  open: { label: "Open", variant: "info" },
  in_progress: { label: "In Progress", variant: "warning" },
  waiting_on_customer: { label: "Waiting on Customer", variant: "secondary" },
  resolved: { label: "Resolved", variant: "success" },
  closed: { label: "Closed", variant: "outline" },
  // Priority
  low: { label: "Low", variant: "outline" },
  medium: { label: "Medium", variant: "secondary" },
  high: { label: "High", variant: "warning" },
  urgent: { label: "Urgent", variant: "destructive" },
  // Projects
  planning: { label: "Planning", variant: "secondary" },
  on_hold: { label: "On Hold", variant: "warning" },
  completed: { label: "Completed", variant: "success" },
  on_track: { label: "On Track", variant: "success" },
  at_risk: { label: "At Risk", variant: "warning" },
  off_track: { label: "Off Track", variant: "destructive" },
  // Invoices
  paid: { label: "Paid", variant: "success" },
  pending: { label: "Pending", variant: "warning" },
  overdue: { label: "Overdue", variant: "destructive" },
  draft: { label: "Draft", variant: "outline" },
  // Generic account
  active: { label: "Active", variant: "success" },
  suspended: { label: "Suspended", variant: "destructive" },
};

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const meta = STATUS_MAP[status] ?? {
    label: status,
    variant: "secondary" as Variant,
  };
  return (
    <Badge variant={meta.variant} className={className}>
      {meta.label}
    </Badge>
  );
}
