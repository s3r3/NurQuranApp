import { Appearance, useColorScheme } from "react-native";
import { useMemo } from "react";
import { useThemeColors } from "./colors";
import { PrayerName } from "../types/quran.types";

export const PRAYER_KEYS: PrayerName[] = [
  "Fajr",
  "Dhuhr",
  "Asr",
  "Maghrib",
  "Isha",
];

export const PRAYER_DISPLAY_NAMES = {
  Fajr: "Fajr",
  Dhuhr: "Dhuhr",
  Asr: "Asr",
  Maghrib: "Maghrib",
  Isha: "Isha",
} as const;

const DARK_PRAYER_COLORS = {
  BACKGROUND: "#0B1535",
  CARD_BG: "#121931",
  ACTIVE_CARD_BG: "#1F2C52",
  CARD_PRIMARY_BG: "#A44AFF",
  PRIMARY: "#A44AFF",
  ACCENT: "#38A3E5",
  TEXT_PRIMARY: "white",
  TEXT_SECONDARY: "#8D92A3",
  HEADER_TEXT: "white",
  COUNTDOWN_TEXT: "white",
} as const;

const LIGHT_PRAYER_COLORS = {
  BACKGROUND: "#FFFFFF",
  CARD_BG: "#F7F7FA",
  ACTIVE_CARD_BG: "#EFE7FF",
  CARD_PRIMARY_BG: "#F0E6FF",
  PRIMARY: "#A44AFF",
  ACCENT: "#0EA5E9",
  TEXT_PRIMARY: "#111111",
  TEXT_SECONDARY: "#666666",
  HEADER_TEXT: "#111111",
  COUNTDOWN_TEXT: "#111111",
} as const;

type PrayerColors = Record<keyof typeof DARK_PRAYER_COLORS, string>;

export const usePrayerColors = () => {
  const colorScheme = useColorScheme();
  const themeColors = useThemeColors();

  const colors = useMemo(() => {
    const baseColors =
      colorScheme === "light" ? LIGHT_PRAYER_COLORS : DARK_PRAYER_COLORS;
    return {
      ...baseColors,
      CARD_BG: themeColors.CARD_BACKGROUND,
    };
  }, [colorScheme, themeColors]);

  return colors;
};

const getPrayerColors = () => {
  return Appearance.getColorScheme() === "light"
    ? LIGHT_PRAYER_COLORS
    : DARK_PRAYER_COLORS;
};

export const PRAYER_COLORS = new Proxy(DARK_PRAYER_COLORS, {
  get: (_target, prop: keyof PrayerColors) => getPrayerColors()[prop],
}) as PrayerColors;

export const NOTIFICATION_SETTINGS = {
  PRE_NOTIFICATION_MINUTES: 15,
  PRE_NOTIFICATION_SECONDS: 15 * 60,
} as const;

export const API_CONFIG = {
  ALADHAN_BASE_URL: "https://api.aladhan.com/v1/timings",
  DEFAULT_METHOD: 3, // Kemenag method for Indonesia
  TIMEOUT: 10000,
} as const;
