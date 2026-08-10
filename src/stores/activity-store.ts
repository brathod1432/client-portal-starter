import { create } from "zustand";

import type { ActivityAction, ActivityEvent } from "@/lib/types";
import { activityEvents as seed } from "@/lib/mock/activity";

/**
 * In-memory audit trail (Phase 14). Every meaningful user action calls
 * `log()`, which is what a real backend audit pipeline would receive. Seeded
 * with historical demo events. See docs/observability.md for the production
 * logging architecture.
 */
interface ActivityState {
  events: ActivityEvent[];
  log: (
    action: ActivityAction,
    actor: string,
    target: string,
    metadata?: Record<string, string>,
  ) => void;
}

export const useActivityStore = create<ActivityState>((set) => ({
  events: seed,
  log(action, actor, target, metadata) {
    const event: ActivityEvent = {
      id: `act_${Date.now()}`,
      action,
      actor,
      target,
      timestamp: new Date().toISOString(),
      // In a real system these are derived server-side from the request.
      ip: "127.0.0.1",
      device: "This session",
      metadata,
    };
    set((state) => ({ events: [event, ...state.events] }));
  },
}));
