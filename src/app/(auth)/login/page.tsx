"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { loginSchema, type LoginInput } from "@/lib/validations";
import { DEMO_PASSWORD, demoUsers } from "@/lib/mock/users";
import { ROLE_LABELS } from "@/lib/rbac";
import { useAuthStore } from "@/stores/auth-store";
import { useActivityStore } from "@/stores/activity-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const log = useActivityStore((s) => s.log);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: true },
  });

  async function onSubmit(values: LoginInput) {
    const result = await login(values.email, values.password);
    if (!result.ok) {
      form.setError("password", { message: result.error });
      return;
    }
    log(
      "login",
      demoUsers.find((u) => u.email === values.email)?.name ?? values.email,
      "Portal session",
    );
    toast.success("Welcome back!");
    router.replace("/dashboard");
  }

  function quickFill(email: string) {
    form.setValue("email", email);
    form.setValue("password", DEMO_PASSWORD);
  }

  const { isSubmitting } = form.formState;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="text-muted-foreground text-sm">
          Enter your credentials to access your portal.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <Link
                    href="/forgot-password"
                    className="text-primary text-xs font-medium hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <PasswordInput
                    autoComplete="current-password"
                    placeholder="••••••••••••"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="remember"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  Keep me signed in on this device
                </FormLabel>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" />
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      </Form>

      <div className="bg-muted/40 rounded-lg border p-4">
        <p className="text-muted-foreground text-xs font-medium">
          Demo accounts — password{" "}
          <code className="bg-background rounded px-1 py-0.5">
            {DEMO_PASSWORD}
          </code>
        </p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {demoUsers.map((u) => (
            <Button
              key={u.id}
              type="button"
              variant="outline"
              size="sm"
              className="justify-start text-xs"
              onClick={() => quickFill(u.email)}
            >
              {ROLE_LABELS[u.role]}
            </Button>
          ))}
        </div>
      </div>

      <p className="text-muted-foreground text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-primary font-medium hover:underline"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
