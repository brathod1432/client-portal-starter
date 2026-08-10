"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  Bell,
  Laptop,
  Lock,
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

  function toggle(key: keyof typeof settings, value: boolean) {
    settings.update({ [key]: value });
    log("settings_update", user?.name ?? "You", key as string);
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
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Sun className="h-4 w-4" /> Appearance
          </TabsTrigger>
        </TabsList>

        {/* SECURITY */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Two-factor authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account with a TOTP
                authenticator app.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="text-muted-foreground h-5 w-5" />
                <div>
                  <p className="text-sm font-medium">Authenticator app</p>
                  <p className="text-muted-foreground text-xs">
                    {settings.twoFactorEnabled ? "Enabled" : "Not configured"}
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.twoFactorEnabled}
                onCheckedChange={(v) => {
                  toggle("twoFactorEnabled", v);
                  toast.success(v ? "2FA enabled" : "2FA disabled");
                }}
                aria-label="Toggle two-factor authentication"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active sessions</CardTitle>
              <CardDescription>
                Devices currently signed in to your account.
              </CardDescription>
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
            <CardContent>
              <ToggleRow
                id="reduceMotion"
                label="Reduce motion"
                description="Minimize non-essential animations"
                checked={settings.reduceMotion}
                onChange={(v) => toggle("reduceMotion", v)}
              />
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
