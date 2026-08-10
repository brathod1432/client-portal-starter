import type { User } from "@/lib/types";

/**
 * Demo accounts — one per role. Passwords are intentionally identical and
 * non-secret ("demo1234") because this is a mock, client-only starter with
 * NO real credential store. See docs/security-model.md for how this maps to
 * a real identity provider.
 */
export const DEMO_PASSWORD = "demo1234";

export const demoUsers: User[] = [
  {
    id: "usr_client",
    name: "Ava Thompson",
    email: "client@acme.example",
    role: "client",
    title: "Operations Lead",
    company: "Acme Retail Group",
    status: "active",
    createdAt: "2024-01-12T09:00:00.000Z",
  },
  {
    id: "usr_agent",
    name: "Marcus Lee",
    email: "agent@northwind.example",
    role: "agent",
    title: "Support Engineer",
    company: "Northwind Services",
    status: "active",
    createdAt: "2023-08-03T09:00:00.000Z",
  },
  {
    id: "usr_manager",
    name: "Priya Nair",
    email: "manager@northwind.example",
    role: "manager",
    title: "Account Manager",
    company: "Northwind Services",
    status: "active",
    createdAt: "2022-11-21T09:00:00.000Z",
  },
  {
    id: "usr_admin",
    name: "Devon Carter",
    email: "admin@northwind.example",
    role: "admin",
    title: "Platform Administrator",
    company: "Northwind Services",
    status: "active",
    createdAt: "2022-05-01T09:00:00.000Z",
  },
];

export function findUserByEmail(email: string): User | undefined {
  return demoUsers.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
  );
}
