"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { KeyRound, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { twoFactorSchema, type TwoFactorInput } from "@/lib/validations";
import { useSettingsStore } from "@/stores/settings-store";
import { useAuthStore } from "@/stores/auth-store";
import { useActivityStore } from "@/stores/activity-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Demo TOTP secret (static — never do this for real; secrets are generated
// server-side and shown once as a QR code).
const DEMO_SECRET = "JBSWY3DPEHPK3PXP";
const RECOVERY_CODES = ["4F2A-9C1B", "7D3E-6A8F", "1B9C-2E4D", "8A5F-3C7B"];

export function TwoFactorCard() {
  const enabled = useSettingsStore((s) => s.twoFactorEnabled);
  const update = useSettingsStore((s) => s.update);
  const user = useAuthStore((s) => s.user);
  const log = useActivityStore((s) => s.log);
  const [setupOpen, setSetupOpen] = React.useState(false);
  const [showRecovery, setShowRecovery] = React.useState(false);

  const form = useForm<TwoFactorInput>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: { code: "" },
  });

  function onVerify(values: TwoFactorInput) {
    // Demo: accept any 6-digit code. A real verifier checks the TOTP window.
    if (values.code.length !== 6) return;
    update({ twoFactorEnabled: true });
    log("settings_update", user?.name ?? "You", "Two-factor enabled");
    setSetupOpen(false);
    setShowRecovery(true);
    form.reset();
    toast.success("Two-factor authentication enabled");
  }

  function disable() {
    update({ twoFactorEnabled: false });
    log("settings_update", user?.name ?? "You", "Two-factor disabled");
    toast.success("Two-factor authentication disabled");
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Two-factor authentication</CardTitle>
          <CardDescription>
            Add a second step at sign-in using an authenticator app (TOTP).
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lock className="text-muted-foreground h-5 w-5" />
            <div>
              <p className="text-sm font-medium">Authenticator app</p>
              <p className="text-muted-foreground text-xs">
                {enabled ? "Enabled" : "Not configured"}
              </p>
            </div>
          </div>
          <Switch
            checked={enabled}
            onCheckedChange={(v) => (v ? setSetupOpen(true) : disable())}
            aria-label="Toggle two-factor authentication"
          />
        </CardContent>
      </Card>

      {/* Setup dialog */}
      <Dialog open={setupOpen} onOpenChange={setSetupOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" /> Set up authenticator
            </DialogTitle>
            <DialogDescription>
              Scan the QR code in your authenticator app, then enter the 6-digit
              code to confirm. (Demo: any 6 digits will work.)
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-3 rounded-lg border p-4">
            {/* Placeholder QR — a real app renders an otpauth:// QR here */}
            <div
              aria-hidden="true"
              className="grid h-32 w-32 grid-cols-8 grid-rows-8 gap-0.5 rounded bg-white p-2"
            >
              {Array.from({ length: 64 }).map((_, i) => (
                <span
                  key={i}
                  className={
                    (i * 7 + (i % 5)) % 3 === 0 ? "bg-black" : "bg-transparent"
                  }
                />
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <KeyRound className="h-3.5 w-3.5" />
              <code className="bg-muted rounded px-1.5 py-0.5">
                {DEMO_SECRET}
              </code>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onVerify)} className="space-y-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification code</FormLabel>
                    <FormControl>
                      <Input
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="123456"
                        autoComplete="one-time-code"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setSetupOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Enable 2FA</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Recovery codes dialog */}
      <Dialog open={showRecovery} onOpenChange={setShowRecovery}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save your recovery codes</DialogTitle>
            <DialogDescription>
              Store these somewhere safe. Each code can be used once if you lose
              access to your authenticator.
            </DialogDescription>
          </DialogHeader>
          <ul className="grid grid-cols-2 gap-2">
            {RECOVERY_CODES.map((code) => (
              <li
                key={code}
                className="bg-muted rounded-md px-3 py-2 text-center font-mono text-sm"
              >
                {code}
              </li>
            ))}
          </ul>
          <DialogFooter>
            <Button onClick={() => setShowRecovery(false)}>
              I&apos;ve saved them
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
