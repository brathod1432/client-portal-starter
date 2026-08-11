"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Camera } from "lucide-react";

import { profileSchema, type ProfileInput } from "@/lib/validations";
import Link from "next/link";

import { useAuthStore } from "@/stores/auth-store";
import { useActivityStore } from "@/stores/activity-store";
import { ROLE_LABELS } from "@/lib/rbac";
import { initials, formatDate, formatDateTime } from "@/lib/format";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
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

const timezones = [
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Australia/Sydney",
];

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const log = useActivityStore((s) => s.log);
  const events = useActivityStore((s) => s.events);

  const lastLogin = React.useMemo(() => {
    const logins = events.filter(
      (e) => e.action === "login" && e.actor === user?.name,
    );
    // Prefer the previous login (not the current session) when available.
    return logins[1] ?? logins[0];
  }, [events, user?.name]);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      title: user?.title ?? "",
      phone: "",
      timezone: "America/New_York",
    },
  });

  function onSubmit(values: ProfileInput) {
    updateProfile({ name: values.name, title: values.title });
    log("profile_update", values.name, "Profile details");
    toast.success("Profile updated");
  }

  function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Basic client-side validation. A backend must re-validate + scan uploads.
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      updateProfile({ avatarUrl: String(reader.result) });
      log("profile_update", user?.name ?? "You", "Avatar updated");
      toast.success("Profile photo updated");
    };
    reader.readAsDataURL(file);
  }

  if (!user) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Manage your personal information and preferences."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col items-center pt-6 text-center">
            <div className="relative">
              <Avatar className="h-24 w-24">
                {user.avatarUrl ? (
                  <AvatarImage src={user.avatarUrl} alt="" />
                ) : null}
                <AvatarFallback className="text-2xl">
                  {initials(user.name)}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                className="bg-background hover:bg-accent focus-visible:ring-ring absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full border shadow-sm focus-visible:ring-2 focus-visible:outline-none"
                aria-label="Change avatar"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="h-4 w-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                tabIndex={-1}
                aria-label="Upload profile photo"
                onChange={onAvatarChange}
              />
            </div>
            <p className="mt-4 text-lg font-semibold">{user.name}</p>
            <p className="text-muted-foreground text-sm">{user.email}</p>
            <Badge variant="secondary" className="mt-2">
              {ROLE_LABELS[user.role]}
            </Badge>
            <p className="text-muted-foreground mt-4 text-xs">
              Member since {formatDate(user.createdAt)}
            </p>
            {lastLogin ? (
              <div className="mt-4 w-full rounded-lg border p-3 text-left">
                <p className="text-xs font-medium">Last sign-in</p>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  {formatDateTime(lastLogin.timestamp)} · {lastLogin.device}
                </p>
                <Link
                  href="/activity-log"
                  className="text-primary mt-1 inline-block text-xs hover:underline"
                >
                  Not you? Review account activity
                </Link>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal information</CardTitle>
            <CardDescription>
              Update your name, title and localization.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
                noValidate
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 000-0000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="timezone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Timezone</FormLabel>
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
                            {timezones.map((tz) => (
                              <SelectItem key={tz} value={tz}>
                                {tz}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit">Save changes</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
