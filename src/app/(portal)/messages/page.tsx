"use client";

import * as React from "react";
import {
  Send,
  Paperclip,
  Check,
  CheckCheck,
  MessageSquare,
  ArrowLeft,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

import { useMessageStore } from "@/stores/message-store";
import { useAuthStore } from "@/stores/auth-store";
import { useActivityStore } from "@/stores/activity-store";
import { cn } from "@/lib/utils";
import { formatRelativeTime, formatDateTime, initials } from "@/lib/format";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function MessagesPage() {
  const conversations = useMessageStore((s) => s.conversations);
  const send = useMessageStore((s) => s.send);
  const markRead = useMessageStore((s) => s.markRead);
  const start = useMessageStore((s) => s.start);
  const user = useAuthStore((s) => s.user);
  const log = useActivityStore((s) => s.log);

  const [activeId, setActiveId] = React.useState(conversations[0]?.id ?? "");
  const [draft, setDraft] = React.useState("");
  const active = conversations.find((c) => c.id === activeId);

  const [composeOpen, setComposeOpen] = React.useState(false);
  const [subject, setSubject] = React.useState("");
  const [recipient, setRecipient] = React.useState("Account team");
  const [firstMessage, setFirstMessage] = React.useState("");

  React.useEffect(() => {
    if (activeId) markRead(activeId);
  }, [activeId, markRead]);

  function handleSend() {
    if (!draft.trim() || !active || !user) return;
    send(active.id, user.name, user.role, draft.trim());
    log("message_sent", user.name, `Conversation: ${active.subject}`);
    setDraft("");
  }

  function handleStart() {
    if (!subject.trim() || !firstMessage.trim() || !user) {
      toast.error("Add a subject and a message");
      return;
    }
    const id = start({
      subject: subject.trim(),
      recipient: recipient.trim() || "Account team",
      author: user.name,
      role: user.role,
      body: firstMessage.trim(),
    });
    log("message_sent", user.name, `Conversation: ${subject.trim()}`);
    setActiveId(id);
    setComposeOpen(false);
    setSubject("");
    setFirstMessage("");
    setRecipient("Account team");
    toast.success("Conversation started");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Messages"
        description="Secure conversations with your account team."
        actions={
          <Button onClick={() => setComposeOpen(true)}>
            <Plus /> New message
          </Button>
        }
      />

      <Card className="grid h-[calc(100vh-16rem)] grid-cols-1 overflow-hidden md:grid-cols-[320px_1fr]">
        {/* Conversation list */}
        <div
          className={cn(
            "flex flex-col border-r",
            active ? "hidden md:flex" : "flex",
          )}
        >
          <div className="border-b px-4 py-3">
            <p className="text-sm font-semibold">Conversations</p>
          </div>
          <ScrollArea className="flex-1">
            <ul>
              {conversations.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(c.id)}
                    className={cn(
                      "hover:bg-accent/50 focus-visible:bg-accent flex w-full items-start gap-3 border-b px-4 py-3 text-left transition-colors focus-visible:outline-none",
                      c.id === activeId && "bg-accent",
                    )}
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="text-xs">
                        {initials(
                          c.participants.find((p) => p !== user?.name) ??
                            c.participants[0],
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium">
                          {c.subject}
                        </p>
                        {c.unread > 0 ? (
                          <Badge className="h-5 min-w-5 justify-center px-1.5 text-[11px]">
                            {c.unread}
                          </Badge>
                        ) : null}
                      </div>
                      <p className="text-muted-foreground truncate text-xs">
                        {c.messages[c.messages.length - 1]?.body}
                      </p>
                      <p className="text-muted-foreground mt-0.5 text-[11px]">
                        {formatRelativeTime(c.lastMessageAt)}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>

        {/* Thread */}
        {active ? (
          <div className="flex flex-col">
            <div className="flex items-center gap-2 border-b px-4 py-3">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setActiveId("")}
                aria-label="Back to conversations"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <p className="text-sm font-semibold">{active.subject}</p>
                <p className="text-muted-foreground text-xs">
                  {active.participants.join(", ")}
                </p>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {active.messages.map((m) => {
                  const mine = m.author === user?.name;
                  return (
                    <div
                      key={m.id}
                      className={cn(
                        "flex gap-2",
                        mine ? "flex-row-reverse" : "flex-row",
                      )}
                    >
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-[10px]">
                          {initials(m.author)}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={cn(
                          "max-w-[75%] rounded-lg px-3 py-2 text-sm",
                          mine
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted",
                        )}
                      >
                        <p>{m.body}</p>
                        {m.attachments.map((a) => (
                          <div
                            key={a.name}
                            className={cn(
                              "mt-2 flex items-center gap-2 rounded border px-2 py-1 text-xs",
                              mine
                                ? "border-primary-foreground/30"
                                : "border-border",
                            )}
                          >
                            <Paperclip className="h-3 w-3" />
                            {a.name}
                          </div>
                        ))}
                        <div
                          className={cn(
                            "mt-1 flex items-center gap-1 text-[10px]",
                            mine
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground",
                          )}
                        >
                          {formatDateTime(m.timestamp)}
                          {mine ? (
                            m.status === "read" ? (
                              <CheckCheck className="h-3 w-3" />
                            ) : (
                              <Check className="h-3 w-3" />
                            )
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <div className="border-t p-3">
              <div className="flex items-end gap-2">
                <Textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  rows={1}
                  placeholder="Type a message… (Enter to send)"
                  className="min-h-[40px] resize-none"
                  aria-label="Message"
                />
                <Button
                  size="icon"
                  onClick={handleSend}
                  disabled={!draft.trim()}
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground hidden flex-col items-center justify-center md:flex">
            <MessageSquare className="mb-2 h-8 w-8" />
            <p className="text-sm">Select a conversation</p>
          </div>
        )}
      </Card>

      <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New message</DialogTitle>
            <DialogDescription>
              Start a new conversation with your account team.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="msg-recipient">To</Label>
              <Input
                id="msg-recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="msg-subject">Subject</Label>
              <Input
                id="msg-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="What's this about?"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="msg-body">Message</Label>
              <Textarea
                id="msg-body"
                rows={4}
                value={firstMessage}
                onChange={(e) => setFirstMessage(e.target.value)}
                placeholder="Type your message…"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setComposeOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleStart}>
              <Send /> Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
