import { Appearance, useColorScheme } from "react-native";
import { useMemo } from "react";

// Palet warna untuk Dark Mode
const DARK_COLORS = {
  PRIMARY: "#A44AFF",
  SECONDARY: "#8D92A3",
  BACKGROUND: "#0B1535",
  CARD_BACKGROUND: "#6236CC",
  ERROR: "#ff5252",
  TEXT: "white",
  BORDER: "rgba(141,146,163,0.1)",
  ACTION_BAR_BG: "rgba(18,25,49,0.5)",
  COLLECTION_PIN: "#FFD700",
  COLLECTION_ERROR: "#FF6B6B",
  COLLECTION_ITEM_BG: "rgba(26, 40, 68, 0.4)",
  COLLECTION_BORDER: "rgba(42, 58, 90, 0.6)",
  BOOKMARK_ADD_SECTION_BG: "rgba(26, 40, 68, 0.3)",
  BOOKMARK_ADD_SECTION_BORDER: "rgba(164, 74, 255, 0.3)",
  BOOKMARK_BORDER: "rgba(141, 146, 163, 0.3)",
  BOOKMARK_COLLECTION_BG: "rgba(26, 40, 68, 0.3)",
  BOOKMARK_PIN: "#FFD700",
  PINK_ACCENT: "pink",
  HOME_ICON_BG: "rgba(164,74,255,0.1)",
} as const;

// Palet warna untuk Light Mode
const LIGHT_COLORS = {
  PRIMARY: "#A44AFF",
  SECONDARY: "#666666",
  BACKGROUND: "#FFFFFF",
  CARD_BACKGROUND: "#F5F5F5",
  ERROR: "#D32F2F",
  TEXT: "#000000",
  BORDER: "rgba(0,0,0,0.1)",
  ACTION_BAR_BG: "rgba(245,245,245,0.9)",
  COLLECTION_PIN: "#FFA500",
  COLLECTION_ERROR: "#E53935",
  COLLECTION_ITEM_BG: "#F5F5F5",
  COLLECTION_BORDER: "rgba(0,0,0,0.15)",
  BOOKMARK_ADD_SECTION_BG: "#F5F5F5",
  BOOKMARK_ADD_SECTION_BORDER: "rgba(164, 74, 255, 0.3)",
  BOOKMARK_BORDER: "rgba(0,0,0,0.1)",
  BOOKMARK_COLLECTION_BG: "#F5F5F5",
  BOOKMARK_PIN: "#FFA500",
  PINK_ACCENT: "#B0005A",
  HOME_ICON_BG: "rgba(164,74,255,0.12)",
} as const;

// Hook untuk mendapatkan warna berdasarkan tema
export const useThemeColors = () => {
  const colorScheme = useColorScheme();

  const colors = useMemo(() => {
    return colorScheme === "light" ? LIGHT_COLORS : DARK_COLORS;
  }, [colorScheme]);

  return colors;
};

type AppColors = Record<keyof typeof DARK_COLORS, string>;
type CollectionColors = {
  PIN: AppColors["COLLECTION_PIN"];
  ERROR: AppColors["COLLECTION_ERROR"];
  ITEM_BG: AppColors["COLLECTION_ITEM_BG"];
  BORDER: AppColors["COLLECTION_BORDER"];
};
type BookmarkColors = {
  ADD_SECTION_BG: AppColors["BOOKMARK_ADD_SECTION_BG"];
  ADD_SECTION_BORDER: AppColors["BOOKMARK_ADD_SECTION_BORDER"];
  BOOKMARK_BORDER: AppColors["BOOKMARK_BORDER"];
  COLLECTION_BG: AppColors["BOOKMARK_COLLECTION_BG"];
  PIN: AppColors["BOOKMARK_PIN"];
};

const getThemeColors = () => {
  return Appearance.getColorScheme() === "light" ? LIGHT_COLORS : DARK_COLORS;
};

// Backward compatibility untuk file lama yang masih import COLORS statis.
export const COLORS = new Proxy(DARK_COLORS, {
  get: (_target, prop: keyof AppColors) => getThemeColors()[prop],
}) as AppColors;

export const COLLECTION_COLORS = new Proxy({} as CollectionColors, {
  get: (_target, prop: keyof CollectionColors) => {
    const colors = getThemeColors();
    const map: CollectionColors = {
      PIN: colors.COLLECTION_PIN,
      ERROR: colors.COLLECTION_ERROR,
      ITEM_BG: colors.COLLECTION_ITEM_BG,
      BORDER: colors.COLLECTION_BORDER,
    };

    return map[prop];
  },
}) as CollectionColors;

export const BOOKMARK_COLORS = new Proxy({} as BookmarkColors, {
  get: (_target, prop: keyof BookmarkColors) => {
    const colors = getThemeColors();
    const map: BookmarkColors = {
      ADD_SECTION_BG: colors.BOOKMARK_ADD_SECTION_BG,
      ADD_SECTION_BORDER: colors.BOOKMARK_ADD_SECTION_BORDER,
      BOOKMARK_BORDER: colors.BOOKMARK_BORDER,
      COLLECTION_BG: colors.BOOKMARK_COLLECTION_BG,
      PIN: colors.BOOKMARK_PIN,
    };

    return map[prop];
  },
}) as BookmarkColors;
