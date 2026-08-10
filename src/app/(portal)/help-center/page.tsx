"use client";

import * as React from "react";
import Link from "next/link";
import {
  BookOpen,
  LifeBuoy,
  MessageSquare,
  Search,
  Rocket,
  CreditCard,
  ShieldCheck,
  FileText,
} from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const topics = [
  { icon: Rocket, title: "Getting started", count: 8 },
  { icon: CreditCard, title: "Billing & payments", count: 12 },
  { icon: FileText, title: "Documents", count: 6 },
  { icon: ShieldCheck, title: "Security & access", count: 9 },
];

const faqs = [
  {
    q: "How do I raise a support ticket?",
    a: "Go to Support tickets and select 'New ticket'. Choose a category and priority, describe your issue, and submit. You'll receive updates in the portal and by email.",
  },
  {
    q: "How is my data protected?",
    a: "Access is governed by role-based permissions, all traffic is encrypted in transit, and every sensitive action is recorded in your activity log. See our security model documentation for details.",
  },
  {
    q: "Can I give my colleagues access?",
    a: "Account managers and administrators can invite additional users and assign roles. Raise an 'Account' ticket to request new seats.",
  },
  {
    q: "How do I pay an invoice?",
    a: "Open Billing & invoices, find the invoice, and select 'Pay'. Paid invoices move to your transaction history and a receipt is available to download.",
  },
  {
    q: "What browsers are supported?",
    a: "The portal supports the latest two versions of Chrome, Edge, Firefox and Safari on desktop and mobile.",
  },
];

export default function HelpCenterPage() {
  const [query, setQuery] = React.useState("");
  const filteredFaqs = faqs.filter((f) =>
    `${f.q} ${f.a}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Help center"
        description="Guides, answers and support — all in one place."
      />

      <Card>
        <CardContent className="p-6">
          <div className="relative mx-auto max-w-xl">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the knowledge base…"
              aria-label="Search help articles"
              className="h-11 pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {topics.map((t) => {
          const Icon = t.icon;
          return (
            <Card
              key={t.title}
              className="hover:bg-accent/50 transition-colors"
            >
              <CardContent className="p-5">
                <span className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-3 font-medium">{t.title}</p>
                <p className="text-muted-foreground text-xs">
                  {t.count} articles
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> Frequently asked questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredFaqs.length === 0 ? (
              <p className="text-muted-foreground py-6 text-center text-sm">
                No articles match “{query}”.
              </p>
            ) : (
              <Accordion type="single" collapsible>
                {filteredFaqs.map((f, i) => (
                  <AccordionItem key={f.q} value={`item-${i}`}>
                    <AccordionTrigger>{f.q}</AccordionTrigger>
                    <AccordionContent>{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Still need help?</CardTitle>
            <CardDescription>
              Our team typically replies within a few hours.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" asChild>
              <Link href="/tickets/new">
                <LifeBuoy /> Open a ticket
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/messages">
                <MessageSquare /> Message your team
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
