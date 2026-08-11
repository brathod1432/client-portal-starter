"use client";

import * as React from "react";

import { useSettingsStore } from "@/stores/settings-store";
import { setLocale } from "@/lib/locale";

/**
 * Applies user preferences globally: text size (root font-size, so the whole
 * rem-based UI scales) and locale/timezone (used by the formatting helpers).
 */
export function PreferenceEffects() {
  const textSize = useSettingsStore((s) => s.textSize);
  const language = useSettingsStore((s) => s.language);
  const timezone = useSettingsStore((s) => s.timezone);

  React.useEffect(() => {
    const root = document.documentElement;
    root.style.fontSize = textSize === "large" ? "18px" : "";
    return () => {
      root.style.fontSize = "";
    };
  }, [textSize]);

  React.useEffect(() => {
    setLocale({ locale: language, timeZone: timezone });
  }, [language, timezone]);

  return null;
}
