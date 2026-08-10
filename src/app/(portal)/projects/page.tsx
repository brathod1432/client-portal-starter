"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { FolderKanban, Search } from "lucide-react";

import type { Project, ProjectStatus } from "@/lib/types";
import { projects } from "@/lib/mock/projects";
import { formatCurrency, formatDate } from "@/lib/format";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable } from "@/components/shared/data-table";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "name",
    header: "Project",
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className="font-medium">{row.original.name}</p>
        <p className="text-muted-foreground truncate text-xs">
          Owner: {row.original.owner}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "health",
    header: "Health",
    cell: ({ row }) => <StatusBadge status={row.original.health} />,
  },
  {
    accessorKey: "progress",
    header: "Progress",
    cell: ({ row }) => (
      <div className="flex w-32 items-center gap-2">
        <Progress value={row.original.progress} className="h-2" />
        <span className="text-muted-foreground w-9 text-right text-xs">
          {row.original.progress}%
        </span>
      </div>
    ),
  },
  {
    accessorKey: "budget",
    header: "Budget",
    cell: ({ row }) => (
      <span className="text-sm">{formatCurrency(row.original.budget)}</span>
    ),
  },
  {
    accessorKey: "dueDate",
    header: "Due",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {formatDate(row.original.dueDate)}
      </span>
    ),
  },
];

export default function ProjectsPage() {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<ProjectStatus | "all">("all");

  const filtered = projects.filter((p) => {
    const matchesQuery = `${p.name} ${p.owner} ${p.status}`
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesStatus = status === "all" || p.status === status;
    return matchesQuery && matchesStatus;
  });

  const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
  const totalSpent = projects.reduce((s, p) => s + p.spent, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Track delivery, budget and health across all engagements."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active engagements</CardDescription>
            <CardTitle className="text-2xl">
              {projects.filter((p) => p.status !== "completed").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total budget</CardDescription>
            <CardTitle className="text-2xl">
              {formatCurrency(totalBudget)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Utilized</CardDescription>
            <CardTitle className="text-2xl">
              {Math.round((totalSpent / totalBudget) * 100)}%
            </CardTitle>
            <CardContent className="p-0">
              <Progress
                value={(totalSpent / totalBudget) * 100}
                className="mt-2 h-2"
              />
            </CardContent>
          </CardHeader>
        </Card>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={(p) => router.push(`/projects/${p.id}`)}
        emptyMessage="No projects match your search."
        toolbar={
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative max-w-sm flex-1">
              <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects…"
                aria-label="Search projects"
                className="pl-9"
              />
            </div>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as ProjectStatus | "all")}
            >
              <SelectTrigger
                className="w-full sm:w-48"
                aria-label="Filter by status"
              >
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />

      {filtered.length === 0 && projects.length === 0 ? (
        <div className="text-muted-foreground flex flex-col items-center py-10">
          <FolderKanban className="mb-2 h-6 w-6" />
          No projects yet.
        </div>
      ) : null}
    </div>
  );
}
