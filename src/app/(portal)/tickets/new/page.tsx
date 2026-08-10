"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Paperclip } from "lucide-react";
import { toast } from "sonner";

import { createTicketSchema, type CreateTicketInput } from "@/lib/validations";
import { useAuthStore } from "@/stores/auth-store";
import { useTicketStore } from "@/stores/ticket-store";
import { useActivityStore } from "@/stores/activity-store";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";
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

  const form = useForm<CreateTicketInput>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      subject: "",
      category: "technical",
      priority: "medium",
      description: "",
    },
  });

  function onSubmit(values: CreateTicketInput) {
    const ticket = create({ ...values, requester: user?.name ?? "You" });
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

              {/* Attachment placeholder — see docs/security-implementation.md (Secure File Upload) */}
              <div className="text-muted-foreground flex items-center gap-3 rounded-lg border border-dashed p-4 text-sm">
                <Paperclip className="h-4 w-4" />
                <span>
                  Attachments will be supported here. Uploads are validated,
                  size-limited and virus-scanned server-side before storage.
                </span>
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
