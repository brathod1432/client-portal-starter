import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PortalSettings {
  // Notification preferences
  emailNotifications: boolean;
  ticketUpdates: boolean;
  invoiceReminders: boolean;
  productAnnouncements: boolean;
  weeklyDigest: boolean;
  // Security
  twoFactorEnabled: boolean;
  // Localization
  timezone: string;
  language: string;
  // Accessibility
  reduceMotion: boolean;
}

interface SettingsState extends PortalSettings {
  update: (patch: Partial<PortalSettings>) => void;
  reset: () => void;
}

const defaults: PortalSettings = {
  emailNotifications: true,
  ticketUpdates: true,
  invoiceReminders: true,
  productAnnouncements: false,
  weeklyDigest: true,
  twoFactorEnabled: false,
  timezone: "America/New_York",
  language: "en-US",
  reduceMotion: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaults,
      update: (patch) => set(patch),
      reset: () => set(defaults),
    }),
    { name: "cps.settings" },
  ),
);
