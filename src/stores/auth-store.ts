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
  login: (email: string, password: string) => Promise<AuthResult>;
  loginAs: (role: Role) => void;
  register: (input: {
    name: string;
    company: string;
    email: string;
  }) => Promise<AuthResult>;
  logout: () => void;
  updateProfile: (patch: Partial<User>) => void;
  setHydrated: () => void;
}

// Simulate network latency for a realistic UX.
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      hydrated: false,

      async login(email, password) {
        await delay(500);
        const user = findUserByEmail(email);
        if (!user || password !== DEMO_PASSWORD) {
          // Generic message avoids user enumeration.
          return { ok: false, error: "Invalid email or password." };
        }
        if (user.status === "suspended") {
          return { ok: false, error: "This account is suspended." };
        }
        set({ user });
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
