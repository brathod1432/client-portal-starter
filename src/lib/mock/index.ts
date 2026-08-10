/**
 * Barrel export for all mock/demo data. Swapping this module for a real
 * data source (API client, TanStack Query hooks) is the primary migration
 * path to a backend — see docs/architecture.md.
 */
export { demoUsers, findUserByEmail, DEMO_PASSWORD } from "./users";
export { projects } from "./projects";
export { tickets } from "./tickets";
export { documents } from "./documents";
export { invoices } from "./invoices";
export { conversations } from "./messages";
export { notifications, announcements } from "./notifications";
export { activityEvents } from "./activity";
