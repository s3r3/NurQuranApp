import { Appearance, useColorScheme } from "react-native";
import { useMemo } from "react";

export const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
] as const;

export const WEEKDAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"] as const;

const DARK_COLORS = {
  PRIMARY: "#A855F7",
  SECONDARY: "#10B981",
  ERROR: "#EF4444",
  WARNING: "#FBBF24",
  INFO: "#3B82F6",
  BACKGROUND: "#081226",
  CARD_BG: "rgba(17, 28, 52, 0.8)",
  TEXT: "white",
  TEXT_SECONDARY: "#94A3B8",
  TEXT_MUTED: "#CBD5E1",
  BORDER: "rgba(168, 85, 247, 0.2)",
  DAY_CELL_BG: "#111C34",
  MODAL_BG: "#172554",
  OVERLAY: "rgba(0,0,0,0.75)",
  PRIMARY_SOFT_BG: "rgba(168, 85, 247, 0.1)",
  SWITCH_TRACK_OFF: "#3E4462",
  IMPORTANT_DOT: "white",
  BUTTON_TEXT: "white",
} as const;

const LIGHT_COLORS = {
  PRIMARY: "#A855F7",
  SECONDARY: "#059669",
  ERROR: "#DC2626",
  WARNING: "#D97706",
  INFO: "#2563EB",
  BACKGROUND: "#FFFFFF",
  CARD_BG: "#F7F7FA",
  TEXT: "#111111",
  TEXT_SECONDARY: "#64748B",
  TEXT_MUTED: "#475569",
  BORDER: "rgba(0, 0, 0, 0.1)",
  DAY_CELL_BG: "#F7F7FA",
  MODAL_BG: "#FFFFFF",
  OVERLAY: "rgba(0,0,0,0.45)",
  PRIMARY_SOFT_BG: "rgba(168, 85, 247, 0.1)",
  SWITCH_TRACK_OFF: "#D1D5DB",
  IMPORTANT_DOT: "#111111",
  BUTTON_TEXT: "white",
} as const;

type CalendarColors = Record<keyof typeof DARK_COLORS, string>;

const getCalendarColors = () => {
  return Appearance.getColorScheme() === "light" ? LIGHT_COLORS : DARK_COLORS;
};

export const COLORS = new Proxy(DARK_COLORS, {
  get: (_target, prop: keyof CalendarColors) => getCalendarColors()[prop],
}) as CalendarColors;

export const useCalendarColors = () => {
  const colorScheme = useColorScheme();

  return useMemo(() => {
    return colorScheme === "light" ? LIGHT_COLORS : DARK_COLORS;
  }, [colorScheme]);
};

export const NOTIFICATION_TIMES = {
  EVENING: 20, // 8 PM
  MORNING: 5,  // 5 AM
} as const;

export const MAX_NOTIFICATIONS = 60;
export const NOTIFICATION_DAYS_LIMIT = 30;
export const WEEKLY_NOTIFICATION_DAYS = 7;
