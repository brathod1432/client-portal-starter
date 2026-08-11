"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  Bell,
  CreditCard,
  Laptop,
  Monitor,
  Moon,
  ShieldCheck,
  Smartphone,
  Sun,
  Trash2,
} from "lucide-react";

import { useSettingsStore } from "@/stores/settings-store";
import { useActivityStore } from "@/stores/activity-store";
import { useAuthStore } from "@/stores/auth-store";
import { PageHeader } from "@/components/shared/page-header";
import { TwoFactorCard } from "@/components/settings/two-factor-card";
import { ChangePasswordCard } from "@/components/settings/change-password-card";
import { DataExportCard } from "@/components/settings/data-export-card";
import { PaymentMethodsCard } from "@/components/settings/payment-methods-card";
import { LocalizationCard } from "@/components/settings/localization-card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const sessions = [
  {
    id: "s1",
    device: "Chrome · macOS",
    location: "Boston, US",
    current: true,
    icon: Laptop,
  },
  {
    id: "s2",
    device: "Safari · iPhone",
    location: "Boston, US",
    current: false,
    icon: Smartphone,
  },
  {
    id: "s3",
    device: "Firefox · Windows",
    location: "Remote",
    current: false,
    icon: Monitor,
  },
];

export default function SettingsPage() {
  const settings = useSettingsStore();
  const { theme, setTheme } = useTheme();
  const log = useActivityStore((s) => s.log);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  function toggle(key: keyof typeof settings, value: boolean) {
    settings.update({ [key]: value });
    log("settings_update", user?.name ?? "You", key as string);
  }

  function signOutEverywhere() {
    log("logout", user?.name ?? "You", "All sessions revoked");
    logout();
    router.replace("/login");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage security, notifications and appearance."
      />

      <Tabs defaultValue="security">
        <TabsList>
          <TabsTrigger value="security">
            <ShieldCheck className="h-4 w-4" /> Security
          </TabsTrigger>
          <TabsTrigger value="billing">
            <CreditCard className="h-4 w-4" /> Billing
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Sun className="h-4 w-4" /> Appearance
          </TabsTrigger>
        </TabsList>

        {/* SECURITY */}
        <TabsContent value="security" className="space-y-6">
          <TwoFactorCard />

          <ChangePasswordCard />

          <Card>
            <CardHeader className="flex-row items-start justify-between space-y-0">
              <div className="space-y-1.5">
                <CardTitle>Active sessions</CardTitle>
                <CardDescription>
                  Devices currently signed in to your account.
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={signOutEverywhere}>
                Sign out everywhere
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {sessions.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="text-muted-foreground h-5 w-5" />
                      <div>
                        <p className="text-sm font-medium">{s.device}</p>
                        <p className="text-muted-foreground text-xs">
                          {s.location}
                        </p>
                      </div>
                    </div>
                    {s.current ? (
                      <Badge variant="success">This device</Badge>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toast.success("Session revoked")}
                      >
                        Revoke
                      </Button>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <DataExportCard />

          <Card className="border-destructive/40">
            <CardHeader>
              <CardTitle className="text-destructive">Danger zone</CardTitle>
              <CardDescription>
                Irreversible actions. Proceed with caution.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 /> Delete account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete your account?</DialogTitle>
                    <DialogDescription>
                      This is a demo — no data is actually deleted. In
                      production this would permanently remove your account and
                      all associated data after a grace period.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="destructive"
                      onClick={() =>
                        toast.success("Demo: account deletion requested")
                      }
                    >
                      I understand, delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>

        {/* BILLING */}
        <TabsContent value="billing" className="space-y-6">
          <PaymentMethodsCard />
        </TabsContent>

        {/* NOTIFICATIONS */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification preferences</CardTitle>
              <CardDescription>
                Choose what you want to hear about and how.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              <ToggleRow
                id="emailNotifications"
                label="Email notifications"
                description="Receive account activity by email"
                checked={settings.emailNotifications}
                onChange={(v) => toggle("emailNotifications", v)}
              />
              <Separator />
              <ToggleRow
                id="ticketUpdates"
                label="Ticket updates"
                description="Status changes and replies on your tickets"
                checked={settings.ticketUpdates}
                onChange={(v) => toggle("ticketUpdates", v)}
              />
              <Separator />
              <ToggleRow
                id="invoiceReminders"
                label="Invoice reminders"
                description="Upcoming and overdue payment reminders"
                checked={settings.invoiceReminders}
                onChange={(v) => toggle("invoiceReminders", v)}
              />
              <Separator />
              <ToggleRow
                id="weeklyDigest"
                label="Weekly digest"
                description="A Monday summary of account activity"
                checked={settings.weeklyDigest}
                onChange={(v) => toggle("weeklyDigest", v)}
              />
              <Separator />
              <ToggleRow
                id="productAnnouncements"
                label="Product announcements"
                description="New features and occasional product news"
                checked={settings.productAnnouncements}
                onChange={(v) => toggle("productAnnouncements", v)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* APPEARANCE */}
        <TabsContent value="appearance" className="space-y-6">
          <LocalizationCard />
          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>Choose how the portal looks.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid max-w-md grid-cols-3 gap-3">
                {[
                  { value: "light", label: "Light", icon: Sun },
                  { value: "dark", label: "Dark", icon: Moon },
                  { value: "system", label: "System", icon: Monitor },
                ].map((opt) => {
                  const Icon = opt.icon;
                  const active = theme === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setTheme(opt.value)}
                      className={`focus-visible:ring-ring flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors focus-visible:ring-2 focus-visible:outline-none ${
                        active
                          ? "border-primary bg-primary/5"
                          : "hover:bg-accent"
                      }`}
                      aria-pressed={active}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-sm">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Accessibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ToggleRow
                id="reduceMotion"
                label="Reduce motion"
                description="Minimize non-essential animations"
                checked={settings.reduceMotion}
                onChange={(v) => toggle("reduceMotion", v)}
              />
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5 pr-4">
                  <Label>Text size</Label>
                  <p className="text-muted-foreground text-xs">
                    Increase text and spacing across the portal.
                  </p>
                </div>
                <div className="flex gap-2">
                  {(["normal", "large"] as const).map((size) => (
                    <Button
                      key={size}
                      type="button"
                      variant={
                        settings.textSize === size ? "default" : "outline"
                      }
                      size="sm"
                      aria-pressed={settings.textSize === size}
                      onClick={() => {
                        settings.update({ textSize: size });
                        log(
                          "settings_update",
                          user?.name ?? "You",
                          `Text size: ${size}`,
                        );
                      }}
                    >
                      {size === "normal" ? "Normal" : "Large"}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ToggleRow({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="space-y-0.5 pr-4">
        <Label htmlFor={id}>{label}</Label>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
