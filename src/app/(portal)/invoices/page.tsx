"use client";

import * as React from "react";
import { Download, CreditCard, FileDown, Receipt, Loader2 } from "lucide-react";
import { toast } from "sonner";

import type { Invoice } from "@/lib/types";
import { useInvoiceStore } from "@/stores/invoice-store";
import { useAuthStore } from "@/stores/auth-store";
import { useActivityStore } from "@/stores/activity-store";
import { downloadCsv, downloadPlaceholder } from "@/lib/download";
import { formatCurrency, formatDate } from "@/lib/format";
import { PageHeader } from "@/components/shared/page-header";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function InvoicesPage() {
  const invoices = useInvoiceStore((s) => s.invoices);
  const pay = useInvoiceStore((s) => s.pay);
  const user = useAuthStore((s) => s.user);
  const log = useActivityStore((s) => s.log);

  const [payTarget, setPayTarget] = React.useState<Invoice | null>(null);
  const [paying, setPaying] = React.useState(false);

  const outstanding = invoices
    .filter((i) => i.status === "pending" || i.status === "overdue")
    .reduce((s, i) => s + i.amount, 0);
  const paidYtd = invoices
    .filter((i) => i.status === "paid")
    .reduce((s, i) => s + i.amount, 0);

  async function confirmPay() {
    if (!payTarget) return;
    setPaying(true);
    await new Promise((r) => setTimeout(r, 900));
    pay(payTarget.id);
    log("invoice_view", user?.name ?? "You", payTarget.number, {
      action: "payment",
    });
    setPaying(false);
    toast.success(`Payment received for ${payTarget.number}`);
    setPayTarget(null);
  }

  function exportCsv() {
    downloadCsv(
      invoices.map((i) => ({
        number: i.number,
        status: i.status,
        amount: i.amount,
        currency: i.currency,
        issued: i.issuedDate,
        due: i.dueDate,
        paid: i.paidDate ?? "",
      })),
      "invoices.csv",
    );
    toast.success("Exported invoices.csv");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing & invoices"
        description="Review statements, download invoices and settle balances."
        actions={
          <Button variant="outline" onClick={exportCsv}>
            <FileDown /> Export CSV
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Outstanding</CardDescription>
            <CardTitle className="text-destructive text-2xl">
              {formatCurrency(outstanding)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Paid year-to-date</CardDescription>
            <CardTitle className="text-2xl">
              {formatCurrency(paidYtd)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Next payment due</CardDescription>
            <CardTitle className="text-2xl">
              {formatDate(
                invoices.find((i) => i.status === "pending")?.dueDate ??
                  new Date().toISOString(),
              )}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-4 w-4" /> Transaction history
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Issued</TableHead>
                <TableHead>Due</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-medium">{inv.number}</TableCell>
                  <TableCell>
                    <StatusBadge status={inv.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(inv.issuedDate)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(inv.dueDate)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(inv.amount, inv.currency)}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Download ${inv.number}`}
                        onClick={() =>
                          downloadPlaceholder(
                            inv.number,
                            `Amount: ${formatCurrency(inv.amount, inv.currency)}`,
                          )
                        }
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      {inv.status === "pending" || inv.status === "overdue" ? (
                        <Can permission="invoices:pay">
                          <Button size="sm" onClick={() => setPayTarget(inv)}>
                            <CreditCard className="h-4 w-4" /> Pay
                          </Button>
                        </Can>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog
        open={!!payTarget}
        onOpenChange={(open) => !open && !paying && setPayTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pay invoice {payTarget?.number}</DialogTitle>
            <DialogDescription>
              This is a demo payment flow — no real charge is made. A production
              build integrates a PCI-compliant provider (e.g. Stripe) via a
              server-side intent.
            </DialogDescription>
          </DialogHeader>
          {payTarget ? (
            <div className="space-y-2 rounded-lg border p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount due</span>
                <span className="font-semibold">
                  {formatCurrency(payTarget.amount, payTarget.currency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Due date</span>
                <span>{formatDate(payTarget.dueDate)}</span>
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setPayTarget(null)}
              disabled={paying}
            >
              Cancel
            </Button>
            <Button onClick={confirmPay} disabled={paying}>
              {paying ? (
                <>
                  <Loader2 className="animate-spin" /> Processing…
                </>
              ) : (
                <>
                  <CreditCard /> Pay now
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
