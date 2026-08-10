import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Role, User } from "@/lib/types";
import { DEMO_PASSWORD, demoUsers, findUserByEmail } from "@/lib/mock/users";

/**
 * Mock authentication store.
 *
 * SECURITY NOTE: This starter persists a demo user to localStorage purely so
 * the client-only demo survives refreshes. In production you MUST replace this
 * with server-issued, httpOnly, SameSite cookies and never store session
 * tokens in JavaScript-accessible storage (XSS exfiltration risk). See
 * docs/security-implementation.md → "Session Management Design".
 */

export interface AuthResult {
  ok: boolean;
  error?: string;
}

interface AuthState {
  user: User | null;
  hydrated: boolean;
  failedAttempts: number;
  lockedUntil: number | null;
  login: (email: string, password: string) => Promise<AuthResult>;
  loginAs: (role: Role) => void;
  register: (input: {
    name: string;
    company: string;
    email: string;
  }) => Promise<AuthResult>;
  logout: () => void;
  updateProfile: (patch: Partial<User>) => void;
  changePassword: (current: string, next: string) => Promise<AuthResult>;
  setHydrated: () => void;
}

// Simulate network latency for a realistic UX.
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Brute-force mitigation: lock the form after repeated failures. In production
// this MUST also be enforced server-side (per-account + per-IP). See
// docs/security-implementation.md → "Rate Limiting Strategy".
const MAX_ATTEMPTS = 5;
const LOCK_MS = 30_000;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      hydrated: false,
      failedAttempts: 0,
      lockedUntil: null,

      async login(email, password) {
        const { lockedUntil } = get();
        if (lockedUntil && Date.now() < lockedUntil) {
          const secs = Math.ceil((lockedUntil - Date.now()) / 1000);
          return {
            ok: false,
            error: `Too many attempts. Try again in ${secs}s.`,
          };
        }

        await delay(500);
        const user = findUserByEmail(email);
        if (!user || password !== DEMO_PASSWORD) {
          const attempts = get().failedAttempts + 1;
          const locked = attempts >= MAX_ATTEMPTS;
          set({
            failedAttempts: locked ? 0 : attempts,
            lockedUntil: locked ? Date.now() + LOCK_MS : null,
          });
          // Generic message avoids user enumeration.
          return {
            ok: false,
            error: locked
              ? `Too many attempts. Account locked for ${LOCK_MS / 1000}s.`
              : "Invalid email or password.",
          };
        }
        if (user.status === "suspended") {
          return { ok: false, error: "This account is suspended." };
        }
        set({ user, failedAttempts: 0, lockedUntil: null });
        return { ok: true };
      },

      loginAs(role) {
        const user = demoUsers.find((u) => u.role === role);
        if (user) set({ user });
      },

      async register({ name, company, email }) {
        await delay(600);
        if (findUserByEmail(email)) {
          return { ok: false, error: "An account with that email exists." };
        }
        const user: User = {
          id: `usr_${Date.now()}`,
          name,
          company,
          email,
          role: "client",
          title: "Client User",
          status: "active",
          createdAt: new Date().toISOString(),
        };
        set({ user });
        return { ok: true };
      },

      logout() {
        set({ user: null });
      },

      updateProfile(patch) {
        const current = get().user;
        if (current) set({ user: { ...current, ...patch } });
      },

      async changePassword(current, next) {
        await delay(500);
        // Demo only: the mock has a single shared password. A real backend
        // verifies the current password against a hash (argon2id/bcrypt) and
        // stores a new hash. See docs/security-implementation.md.
        if (current !== DEMO_PASSWORD) {
          return { ok: false, error: "Current password is incorrect." };
        }
        if (next === current) {
          return {
            ok: false,
            error: "New password must differ from the current one.",
          };
        }
        return { ok: true };
      },

      setHydrated() {
        set({ hydrated: true });
      },
    }),
    {
      name: "cps.auth",
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);
