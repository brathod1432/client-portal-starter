"use client";

import * as React from "react";
import { notFound } from "next/navigation";
import { use } from "react";
import {
  MessageSquarePlus,
  Paperclip,
  Send,
  UserPlus,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

import type { TicketStatus } from "@/lib/types";
import { useTicketStore } from "@/stores/ticket-store";
import { useAuthStore } from "@/stores/auth-store";
import { useActivityStore } from "@/stores/activity-store";
import { formatDateTime, initials } from "@/lib/format";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Can } from "@/components/rbac/can";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const ticket = useTicketStore((s) => s.tickets.find((t) => t.id === id));
  const addComment = useTicketStore((s) => s.addComment);
  const setStatus = useTicketStore((s) => s.setStatus);
  const assign = useTicketStore((s) => s.assign);
  const user = useAuthStore((s) => s.user);
  const log = useActivityStore((s) => s.log);
  const [comment, setComment] = React.useState("");

  if (!ticket) notFound();

  const author = user?.name ?? "You";

  function handleComment() {
    if (!comment.trim()) return;
    addComment(ticket!.id, author, comment.trim());
    log("ticket_update", author, ticket!.reference, { action: "comment" });
    setComment("");
    toast.success("Reply added");
  }

  function handleStatus(status: TicketStatus) {
    setStatus(ticket!.id, status, author);
    log("ticket_update", author, ticket!.reference, { status });
    toast.success("Ticket status updated");
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Tickets", href: "/tickets" },
          { label: ticket.reference },
        ]}
      />
      <PageHeader
        title={ticket.subject}
        description={`${ticket.reference} · opened by ${ticket.requester}`}
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge status={ticket.priority} />
            <StatusBadge status={ticket.status} />
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Conversation / timeline */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                {ticket.description}
              </p>
              {ticket.hasAttachments ? (
                <div className="mt-4 flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                  <Paperclip className="text-muted-foreground h-4 w-4" />
                  switch-logs.txt
                  <span className="text-muted-foreground ml-auto text-xs">
                    42 KB
                  </span>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="before:bg-border relative space-y-6 before:absolute before:top-2 before:left-4 before:h-[calc(100%-1rem)] before:w-px">
                {ticket.timeline.map((event) => (
                  <li key={event.id} className="relative flex gap-4">
                    <Avatar className="bg-background h-8 w-8 border">
                      <AvatarFallback className="text-[10px]">
                        {initials(event.author)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2">
                        <span className="text-sm font-medium">
                          {event.author}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {formatDateTime(event.timestamp)}
                        </span>
                      </div>
                      <p className="text-muted-foreground mt-0.5 text-sm">
                        {event.message}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <Separator className="my-6" />

              <div className="space-y-3">
                <label htmlFor="reply" className="text-sm font-medium">
                  Add a reply
                </label>
                <Textarea
                  id="reply"
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Type your message…"
                />
                <div className="flex justify-end">
                  <Button onClick={handleComment} disabled={!comment.trim()}>
                    <Send /> Send reply
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: metadata + agent controls */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Row label="Requester" value={ticket.requester} />
              <Row label="Assignee" value={ticket.assignee ?? "Unassigned"} />
              <Row
                label="Category"
                value={ticket.category.replace(/_/g, " ")}
                capitalize
              />
              <Row label="Created" value={formatDateTime(ticket.createdAt)} />
              <Row label="Updated" value={formatDateTime(ticket.updatedAt)} />
            </CardContent>
          </Card>

          <Can permission="tickets:manage">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquarePlus className="h-4 w-4" /> Agent actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-muted-foreground text-xs font-medium">
                    Change status
                  </label>
                  <Select
                    value={ticket.status}
                    onValueChange={(v) => handleStatus(v as TicketStatus)}
                  >
                    <SelectTrigger aria-label="Change ticket status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
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
                <Can permission="tickets:assign">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      assign(ticket.id, author, author);
                      toast.success(`Assigned to ${author}`);
                    }}
                  >
                    <UserPlus /> Assign to me
                  </Button>
                </Can>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleStatus("resolved")}
                >
                  <CheckCircle2 /> Mark resolved
                </Button>
              </CardContent>
            </Card>
          </Can>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  capitalize,
}: {
  label: string;
  value: string;
  capitalize?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-medium ${capitalize ? "capitalize" : ""}`}>
        {value}
      </span>
    </div>
  );
}
