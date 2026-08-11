/**
 * Ambient locale used by the formatting helpers so user Language/Timezone
 * preferences actually affect how dates, times and currency render.
 *
 * The value initializes synchronously from the persisted settings (so the very
 * first paint after a reload is already in the user's locale) and is kept in
 * sync live by PreferenceEffects.
 */

export interface LocaleState {
  locale: string;
  timeZone?: string;
}

const DEFAULT: LocaleState = { locale: "en-US", timeZone: undefined };

function readPersisted(): LocaleState {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = window.localStorage.getItem("cps.settings");
    if (!raw) return DEFAULT;
    const parsed = JSON.parse(raw) as {
      state?: { language?: string; timezone?: string };
    };
    return {
      locale: parsed.state?.language || DEFAULT.locale,
      timeZone: parsed.state?.timezone || DEFAULT.timeZone,
    };
  } catch {
    return DEFAULT;
  }
}

let current: LocaleState = readPersisted();

export function getLocale(): LocaleState {
  return current;
}

export function setLocale(next: Partial<LocaleState>): void {
  current = { ...current, ...next };
}
