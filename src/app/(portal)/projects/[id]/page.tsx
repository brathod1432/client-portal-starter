"use client";

import * as React from "react";
import { notFound } from "next/navigation";
import { use } from "react";
import {
  Calendar,
  CircleDollarSign,
  User,
  CheckCircle2,
  Circle,
} from "lucide-react";

import { projects } from "@/lib/mock/projects";
import { formatCurrency, formatDate } from "@/lib/format";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const project = projects.find((p) => p.id === id);
  if (!project) notFound();

  const budgetPct = Math.round((project.spent / project.budget) * 100);

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Projects", href: "/projects" },
          { label: project.name },
        ]}
      />
      <PageHeader
        title={project.name}
        description={project.client}
        actions={<StatusBadge status={project.status} />}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <User className="text-muted-foreground h-5 w-5" />
            <div>
              <p className="text-muted-foreground text-xs">Owner</p>
              <p className="text-sm font-medium">{project.owner}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Calendar className="text-muted-foreground h-5 w-5" />
            <div>
              <p className="text-muted-foreground text-xs">Timeline</p>
              <p className="text-sm font-medium">
                {formatDate(project.startDate)} – {formatDate(project.dueDate)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <CircleDollarSign className="text-muted-foreground h-5 w-5" />
            <div>
              <p className="text-muted-foreground text-xs">Budget</p>
              <p className="text-sm font-medium">
                {formatCurrency(project.budget)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="w-full">
              <p className="text-muted-foreground text-xs">Health</p>
              <StatusBadge status={project.health} className="mt-1" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground text-sm">
              {project.description}
            </p>
            <Separator />
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium">Completion</span>
                <span className="text-muted-foreground">
                  {project.progress}%
                </span>
              </div>
              <Progress value={project.progress} />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium">Budget utilization</span>
                <span className="text-muted-foreground">
                  {formatCurrency(project.spent)} of{" "}
                  {formatCurrency(project.budget)} ({budgetPct}%)
                </span>
              </div>
              <Progress
                value={budgetPct}
                indicatorClassName={
                  budgetPct > 90 ? "bg-destructive" : undefined
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Milestones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {project.tasks.map((task) => (
              <div key={task.id} className="flex items-start gap-3">
                {task.done ? (
                  <CheckCircle2 className="text-success mt-0.5 h-4 w-4 shrink-0" />
                ) : (
                  <Circle className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
                )}
                <div className="min-w-0">
                  <p
                    className={`text-sm ${
                      task.done
                        ? "text-muted-foreground line-through"
                        : "font-medium"
                    }`}
                  >
                    {task.title}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {task.assignee} · {formatDate(task.dueDate)}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
