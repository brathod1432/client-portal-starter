"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus, Paperclip, Search, FileDown } from "lucide-react";
import { toast } from "sonner";

import type { Ticket, TicketStatus } from "@/lib/types";
import { useTicketStore } from "@/stores/ticket-store";
import { formatRelativeTime } from "@/lib/format";
import { ticketSla } from "@/lib/sla";
import { downloadCsv } from "@/lib/download";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/data-table";
import { Can } from "@/components/rbac/can";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const columns: ColumnDef<Ticket>[] = [
  {
    accessorKey: "reference",
    header: "Ref",
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono text-xs">
        {row.original.reference}
      </span>
    ),
  },
  {
    accessorKey: "subject",
    header: "Subject",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-medium">{row.original.subject}</span>
        {row.original.hasAttachments ? (
          <Paperclip className="text-muted-foreground h-3.5 w-3.5" />
        ) : null}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => <StatusBadge status={row.original.priority} />,
  },
  {
    accessorKey: "assignee",
    header: "Assignee",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {row.original.assignee ?? "Unassigned"}
      </span>
    ),
  },
  {
    id: "sla",
    header: "SLA",
    cell: ({ row }) => {
      const sla = ticketSla(row.original);
      if (sla.state === "none") {
        return <span className="text-muted-foreground text-sm">—</span>;
      }
      const variant =
        sla.state === "overdue"
          ? "destructive"
          : sla.state === "due_soon"
            ? "warning"
            : "secondary";
      return <Badge variant={variant}>{sla.label}</Badge>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {formatRelativeTime(row.original.updatedAt)}
      </span>
    ),
  },
];

export default function TicketsPage() {
  const router = useRouter();
  const tickets = useTicketStore((s) => s.tickets);
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<TicketStatus | "all">("all");

  const filtered = tickets.filter((t) => {
    const matchesQuery = `${t.subject} ${t.reference} ${t.requester}`
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesStatus = status === "all" || t.status === status;
    return matchesQuery && matchesStatus;
  });

  function exportCsv() {
    downloadCsv(
      filtered.map((t) => ({
        reference: t.reference,
        subject: t.subject,
        status: t.status,
        priority: t.priority,
        category: t.category,
        requester: t.requester,
        assignee: t.assignee ?? "",
        updated: t.updatedAt,
      })),
      "tickets.csv",
    );
    toast.success("Exported tickets.csv");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Support tickets"
        description="Raise, track and resolve support requests."
        actions={
          <>
            <Button variant="outline" onClick={exportCsv}>
              <FileDown /> Export CSV
            </Button>
            <Can permission="tickets:create">
              <Button asChild>
                <Link href="/tickets/new">
                  <Plus /> New ticket
                </Link>
              </Button>
            </Can>
          </>
        }
      />

      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={(t) => router.push(`/tickets/${t.id}`)}
        emptyMessage="No tickets match your filters."
        toolbar={
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative max-w-sm flex-1">
              <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tickets…"
                aria-label="Search tickets"
                className="pl-9"
              />
            </div>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as TicketStatus | "all")}
            >
              <SelectTrigger
                className="w-full sm:w-48"
                aria-label="Filter by status"
              >
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="waiting_on_customer">
                  Waiting on Customer
                </SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />
    </div>
  );
}
