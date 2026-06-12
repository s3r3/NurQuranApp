import { Appearance } from "react-native";

const DARK_SEARCH_COLORS = {
  primary: "#A44AFF",
  background: "#0B1535",
  cardBackground: "rgba(26, 40, 68, 0.4)",
  inputBackground: "#121931",
  text: "white",
  secondaryText: "#8D92A3",
  border: "rgba(164, 74, 255, 0.2)",
  placeholder: "#8D92A3",
} as const;

const LIGHT_SEARCH_COLORS = {
  primary: "#A44AFF",
  background: "#FFFFFF",
  cardBackground: "#F7F7FA",
  inputBackground: "#F1F1F5",
  text: "#111111",
  secondaryText: "#666666",
  border: "rgba(0, 0, 0, 0.1)",
  placeholder: "#777777",
} as const;

type SearchColors = Record<keyof typeof DARK_SEARCH_COLORS, string>;

const getSearchColors = () => {
  return Appearance.getColorScheme() === "light"
    ? LIGHT_SEARCH_COLORS
    : DARK_SEARCH_COLORS;
};

export const SEARCH_COLORS = new Proxy(DARK_SEARCH_COLORS, {
  get: (_target, prop: keyof SearchColors) => getSearchColors()[prop],
}) as SearchColors;

export const SEARCH_SIZES = {
  borderRadius: 12,
  padding: 20,
  cardPadding: 16,
  numberBadge: 40,
  searchBarHeight: 50,
  iconSize: 24,
  smallIconSize: 20,
  emptyIconSize: 80,
} as const;

export const SEARCH_MESSAGES = {
  MIN_CHARACTERS: "Enter at least 2 characters to search Quran surahs",
  NO_RESULTS: "Surah Not Found",
  TRY_DIFFERENT: "Try searching with different keywords",
  START_SEARCH: "Start Search",
  FOUND_RESULTS: "Found",
  RESULTS: "results",
  SEARCH_PLACEHOLDER: "Search Surah (example: Al-Fatihah)",
} as const;
