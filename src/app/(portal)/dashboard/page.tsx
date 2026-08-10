"use client";

import * as React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  FolderKanban,
  LifeBuoy,
  Receipt,
  MessageSquare,
  FileText,
  Plus,
  Upload,
  CreditCard,
  ArrowRight,
  CheckCircle2,
  Megaphone,
} from "lucide-react";

import { formatCurrency, formatRelativeTime, formatDate } from "@/lib/format";
import { ROLE_LABELS } from "@/lib/rbac";
import { useAuthStore } from "@/stores/auth-store";
import { useTicketStore } from "@/stores/ticket-store";
import { useInvoiceStore } from "@/stores/invoice-store";
import { useMessageStore } from "@/stores/message-store";
import { useActivityStore } from "@/stores/activity-store";
import { projects } from "@/lib/mock/projects";
import { documents } from "@/lib/mock/documents";
import { announcements } from "@/lib/mock/notifications";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { OnboardingChecklist } from "@/components/dashboard/onboarding-checklist";
import { StatusBadge } from "@/components/shared/status-badge";
import { Can } from "@/components/rbac/can";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const DashboardCharts = dynamic(
  () => import("@/components/dashboard/dashboard-charts"),
  {
    ssr: false,
    loading: () => (
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    ),
  },
);

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const tickets = useTicketStore((s) => s.tickets);
  const invoices = useInvoiceStore((s) => s.invoices);
  const conversations = useMessageStore((s) => s.conversations);
  const events = useActivityStore((s) => s.events);

  const openTickets = tickets.filter(
    (t) => t.status === "open" || t.status === "in_progress",
  ).length;
  const activeProjects = projects.filter(
    (p) => p.status !== "completed",
  ).length;
  const outstanding = invoices
    .filter((i) => i.status === "pending" || i.status === "overdue")
    .reduce((sum, i) => sum + i.amount, 0);
  const unreadMessages = conversations.reduce((sum, c) => sum + c.unread, 0);

  const upcomingTasks = projects
    .flatMap((p) =>
      p.tasks.filter((t) => !t.done).map((t) => ({ ...t, project: p.name })),
    )
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 5);

  const recentDocs = [...documents]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 4);

  const firstName = user?.name.split(" ")[0] ?? "there";

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description={
          user
            ? `${ROLE_LABELS[user.role]} · ${user.company}`
            : "Here's what's happening across your account."
        }
        actions={
          <>
            <Can permission="tickets:create">
              <Button asChild>
                <Link href="/tickets/new">
                  <Plus /> New ticket
                </Link>
              </Button>
            </Can>
            <Button variant="outline" asChild>
              <Link href="/messages">
                <MessageSquare /> Messages
              </Link>
            </Button>
          </>
        }
      />

      <OnboardingChecklist />

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active projects"
          value={activeProjects}
          icon={FolderKanban}
          hint={`${projects.length} total engagements`}
          trend={{ value: 8, direction: "up" }}
        />
        <StatCard
          label="Open tickets"
          value={openTickets}
          icon={LifeBuoy}
          hint="Avg. first response 2h 15m"
          trend={{ value: 12, direction: "down", positive: true }}
        />
        <Can permission="invoices:view" fallback={<span className="hidden" />}>
          <StatCard
            label="Outstanding balance"
            value={formatCurrency(outstanding)}
            icon={Receipt}
            hint="Across pending & overdue"
            trend={{ value: 3, direction: "up", positive: false }}
          />
        </Can>
        <StatCard
          label="Unread messages"
          value={unreadMessages}
          icon={MessageSquare}
          hint={`${conversations.length} active conversations`}
        />
      </div>

      {/* Overdue alert */}
      {invoices.some((i) => i.status === "overdue") ? (
        <Can permission="invoices:view">
          <Alert variant="warning">
            <Receipt />
            <AlertTitle>You have an overdue invoice</AlertTitle>
            <AlertDescription>
              Please review your billing to avoid service interruption.{" "}
              <Link href="/invoices" className="font-medium underline">
                Go to invoices
              </Link>
            </AlertDescription>
          </Alert>
        </Can>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: projects + charts */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Projects overview</CardTitle>
                <CardDescription>Delivery status at a glance</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/projects">
                  View all <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {projects.slice(0, 4).map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="hover:bg-accent/50 focus-visible:ring-ring block rounded-lg border p-4 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate font-medium">{p.name}</p>
                    <StatusBadge status={p.health} />
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <Progress value={p.progress} className="h-2" />
                    <span className="text-muted-foreground w-10 shrink-0 text-right text-xs">
                      {p.progress}%
                    </span>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          <DashboardCharts />
        </div>

        {/* Right rail */}
        <div className="space-y-6">
          {/* Quick actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <Can permission="tickets:create">
                <Button
                  variant="outline"
                  className="h-auto flex-col gap-1.5 py-3"
                  asChild
                >
                  <Link href="/tickets/new">
                    <Plus className="h-4 w-4" />
                    <span className="text-xs">New ticket</span>
                  </Link>
                </Button>
              </Can>
              <Can permission="documents:upload">
                <Button
                  variant="outline"
                  className="h-auto flex-col gap-1.5 py-3"
                  asChild
                >
                  <Link href="/documents">
                    <Upload className="h-4 w-4" />
                    <span className="text-xs">Upload file</span>
                  </Link>
                </Button>
              </Can>
              <Can permission="invoices:pay">
                <Button
                  variant="outline"
                  className="h-auto flex-col gap-1.5 py-3"
                  asChild
                >
                  <Link href="/invoices">
                    <CreditCard className="h-4 w-4" />
                    <span className="text-xs">Pay invoice</span>
                  </Link>
                </Button>
              </Can>
              <Button
                variant="outline"
                className="h-auto flex-col gap-1.5 py-3"
                asChild
              >
                <Link href="/documents">
                  <FileText className="h-4 w-4" />
                  <span className="text-xs">Documents</span>
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Account status */}
          <Card>
            <CardHeader>
              <CardTitle>Account status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Plan</span>
                <span className="font-medium">Enterprise · Managed</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <StatusBadge status="active" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Support tier</span>
                <span className="font-medium">24/7 Priority</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Renews</span>
                <span className="font-medium">Jan 15, 2026</span>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming tasks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingTasks.map((task) => (
                <div
                  key={`${task.project}-${task.id}`}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{task.title}</p>
                    <p className="text-muted-foreground truncate text-xs">
                      {task.project} · due {formatDate(task.dueDate)}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom: recent activity + documents + announcements */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Recent activity</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/activity-log">All</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {events.slice(0, 5).map((e) => (
              <div key={e.id} className="flex items-start gap-3 text-sm">
                <span className="bg-primary mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
                <div className="min-w-0">
                  <p className="truncate">
                    <span className="font-medium">{e.actor}</span>{" "}
                    <span className="text-muted-foreground">
                      {e.action.replace(/_/g, " ")}
                    </span>
                  </p>
                  <p className="text-muted-foreground truncate text-xs">
                    {e.target} · {formatRelativeTime(e.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Recent documents</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/documents">All</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentDocs.map((d) => (
              <Link
                key={d.id}
                href="/documents"
                className="hover:bg-accent/50 flex items-center gap-3 rounded-md p-1 text-sm"
              >
                <FileText className="text-muted-foreground h-4 w-4 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{d.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {formatDate(d.updatedAt)}
                  </p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-4 w-4" /> Announcements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {announcements.map((a) => (
              <div key={a.id} className="space-y-1">
                <p className="text-sm font-medium">{a.title}</p>
                <p className="text-muted-foreground text-xs">{a.body}</p>
                <p className="text-muted-foreground text-[11px]">
                  {formatDate(a.date)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
