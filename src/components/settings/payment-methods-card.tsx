"use client";

import * as React from "react";
import { CreditCard, Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { usePaymentStore } from "@/stores/payment-store";
import { useActivityStore } from "@/stores/activity-store";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const BRAND_LABEL = { visa: "Visa", mastercard: "Mastercard", amex: "Amex" };

export function PaymentMethodsCard() {
  const methods = usePaymentStore((s) => s.methods);
  const autoPay = usePaymentStore((s) => s.autoPay);
  const addCard = usePaymentStore((s) => s.addCard);
  const removeCard = usePaymentStore((s) => s.removeCard);
  const setDefault = usePaymentStore((s) => s.setDefault);
  const setAutoPay = usePaymentStore((s) => s.setAutoPay);
  const log = useActivityStore((s) => s.log);
  const user = useAuthStore((s) => s.user);

  const [open, setOpen] = React.useState(false);
  const [number, setNumber] = React.useState("");
  const [exp, setExp] = React.useState("");

  function handleAdd() {
    const digits = number.replace(/\D/g, "");
    const [mm, yy] = exp.split("/");
    if (digits.length < 12 || !mm || !yy) {
      toast.error("Enter a valid card number and expiry (MM/YY)");
      return;
    }
    addCard({
      brand: "visa",
      last4: digits.slice(-4),
      expMonth: Number(mm),
      expYear: 2000 + Number(yy),
    });
    log("settings_update", user?.name ?? "You", "Payment method added");
    toast.success("Card added");
    setNumber("");
    setExp("");
    setOpen(false);
  }

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div className="space-y-1.5">
          <CardTitle>Payment methods</CardTitle>
          <CardDescription>
            Manage cards used for invoice payments.
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          <Plus /> Add card
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {methods.map((m) => (
          <div
            key={m.id}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <div className="flex items-center gap-3">
              <CreditCard className="text-muted-foreground h-5 w-5" />
              <div>
                <p className="text-sm font-medium">
                  {BRAND_LABEL[m.brand]} •••• {m.last4}
                  {m.isDefault ? (
                    <Badge variant="secondary" className="ml-2">
                      Default
                    </Badge>
                  ) : null}
                </p>
                <p className="text-muted-foreground text-xs">
                  Expires {String(m.expMonth).padStart(2, "0")}/{m.expYear}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {!m.isDefault ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDefault(m.id)}
                >
                  <Star className="h-4 w-4" /> Default
                </Button>
              ) : null}
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Remove card ending ${m.last4}`}
                onClick={() => {
                  removeCard(m.id);
                  toast.success("Card removed");
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between border-t pt-3">
          <div className="space-y-0.5 pr-4">
            <Label htmlFor="autopay">Auto-pay invoices</Label>
            <p className="text-muted-foreground text-xs">
              Automatically charge the default card when an invoice is due.
            </p>
          </div>
          <Switch
            id="autopay"
            checked={autoPay}
            onCheckedChange={(v) => {
              setAutoPay(v);
              log(
                "settings_update",
                user?.name ?? "You",
                `Auto-pay ${v ? "enabled" : "disabled"}`,
              );
            }}
          />
        </div>
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a payment method</DialogTitle>
            <DialogDescription>
              Demo only — no real card is stored. Production tokenizes the card
              via a PCI-compliant provider; only the last 4 digits are kept.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardnum">Card number</Label>
              <Input
                id="cardnum"
                inputMode="numeric"
                placeholder="4242 4242 4242 4242"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardexp">Expiry (MM/YY)</Label>
              <Input
                id="cardexp"
                placeholder="08/28"
                value={exp}
                onChange={(e) => setExp(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>Add card</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
