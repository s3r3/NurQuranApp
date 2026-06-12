import { TabConfig } from "../types/quran.types";
import { useTheme } from "../contexts/ThemeContext";

export const HOME_TABS: TabConfig[] = [
  { id: 'Surah', label: 'Surah' },
  { id: 'Para', label: 'Para' },
];

export const DEFAULT_SURAH_NAME = 'Al-Fatihah';
export const DEFAULT_AYAH_NUMBER = 1;

export const HOME_COLORS = {
  BACKGROUND: "#0B1535",
  PRIMARY: "#A44AFF",
  SECONDARY: "#8D92A3",
  CARD_BACKGROUND: "#6236CC",
  TEXT_PRIMARY: "white",
  TEXT_SECONDARY: "#8D92A3",
  ACTIVE_TAB_BORDER: "#A44AFF",
  PINK_ACCENT: "pink",
} as const;

export const CARD_LAYOUT = {
  HEIGHT: 130,
  BORDER_RADIUS: 20,
  PADDING: 15,
} as const;

export const useHomeColors = () => {
  const { colors } = useTheme();

  return {
    BACKGROUND: colors.BACKGROUND,
    PRIMARY: colors.PRIMARY,
    SECONDARY: colors.SECONDARY,
    CARD_BACKGROUND: colors.CARD_BACKGROUND,
    TEXT_PRIMARY: colors.TEXT,
    TEXT_SECONDARY: colors.SECONDARY,
    ACTIVE_TAB_BORDER: colors.PRIMARY,
    PINK_ACCENT: colors.PINK_ACCENT,
    BORDER: colors.BORDER,
    ICON_BG: colors.HOME_ICON_BG,
  } as const;
};
