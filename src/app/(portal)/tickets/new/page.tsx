"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Paperclip, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { createTicketSchema, type CreateTicketInput } from "@/lib/validations";
import { useAuthStore } from "@/stores/auth-store";
import { useTicketStore } from "@/stores/ticket-store";
import { useActivityStore } from "@/stores/activity-store";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";
import { formatFileSize } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NewTicketPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const create = useTicketStore((s) => s.create);
  const log = useActivityStore((s) => s.log);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = React.useState<
    { name: string; sizeKb: number }[]
  >([]);

  const form = useForm<CreateTicketInput>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      subject: "",
      category: "technical",
      priority: "medium",
      description: "",
    },
  });

  function onFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const allowed = /\.(pdf|png|jpe?g|docx?|xlsx?|txt|zip)$/i;
    const next: { name: string; sizeKb: number }[] = [];
    for (const f of files) {
      if (!allowed.test(f.name)) {
        toast.error(`${f.name}: unsupported file type`);
        continue;
      }
      if (f.size > 10 * 1024 * 1024) {
        toast.error(`${f.name}: exceeds 10 MB`);
        continue;
      }
      next.push({
        name: f.name,
        sizeKb: Math.max(1, Math.round(f.size / 1024)),
      });
    }
    setAttachments((prev) => [...prev, ...next].slice(0, 5));
    e.target.value = "";
  }

  function removeAttachment(name: string) {
    setAttachments((prev) => prev.filter((a) => a.name !== name));
  }

  function onSubmit(values: CreateTicketInput) {
    const ticket = create({
      ...values,
      requester: user?.name ?? "You",
      attachments,
    });
    log("ticket_create", user?.name ?? "You", ticket.reference, {
      priority: values.priority,
    });
    toast.success(`Ticket ${ticket.reference} created`);
    router.push(`/tickets/${ticket.id}`);
  }

  const { isSubmitting } = form.formState;

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Tickets", href: "/tickets" },
          { label: "New ticket" },
        ]}
      />
      <PageHeader
        title="Create a ticket"
        description="Describe your request and we'll route it to the right team."
      />

      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
              noValidate
            >
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Brief summary of the issue"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="technical">Technical</SelectItem>
                          <SelectItem value="billing">Billing</SelectItem>
                          <SelectItem value="account">Account</SelectItem>
                          <SelectItem value="feature_request">
                            Feature request
                          </SelectItem>
                          <SelectItem value="general">General</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={7}
                        placeholder="Steps to reproduce, impact, and any relevant context…"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The more detail you provide, the faster we can help.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Attachments — client-side validation only; a backend must
                  re-validate, size-limit and virus-scan. See
                  docs/security-implementation.md (Secure File Upload). */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Attachments</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="hover:bg-accent/50 focus-visible:ring-ring flex w-full items-center justify-center gap-2 rounded-lg border border-dashed p-4 text-sm focus-visible:ring-2 focus-visible:outline-none"
                >
                  <Upload className="h-4 w-4" />
                  Add files (PDF, image, doc, zip · up to 5, 10 MB each)
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="sr-only"
                  tabIndex={-1}
                  aria-label="Add ticket attachments"
                  onChange={onFilesSelected}
                />
                {attachments.length > 0 ? (
                  <ul className="space-y-1.5">
                    {attachments.map((a) => (
                      <li
                        key={a.name}
                        className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
                      >
                        <Paperclip className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{a.name}</span>
                        <span className="text-muted-foreground ml-auto text-xs">
                          {formatFileSize(a.sizeKb)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeAttachment(a.name)}
                          aria-label={`Remove ${a.name}`}
                          className="text-muted-foreground hover:text-foreground rounded p-0.5"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.push("/tickets")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" /> Submitting…
                    </>
                  ) : (
                    "Submit ticket"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
