"use client";

import * as React from "react";

import { useSettingsStore } from "@/stores/settings-store";

/**
 * Applies user accessibility preferences to the document root. Text size uses
 * the root font-size so the whole rem-based UI scales consistently.
 */
export function PreferenceEffects() {
  const textSize = useSettingsStore((s) => s.textSize);

  React.useEffect(() => {
    const root = document.documentElement;
    root.style.fontSize = textSize === "large" ? "18px" : "";
    return () => {
      root.style.fontSize = "";
    };
  }, [textSize]);

  return null;
}
