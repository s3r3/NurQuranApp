import { Book, Clock, Calendar, Bookmark } from "lucide-react-native";
import { TabItem, TabKey } from "../types/tabNavigation.types";
import { useTheme } from "../contexts/ThemeContext";

export const TAB_COLORS = {
  active: "#A44AFF",
  inactive: "#8D92A3",
  background: "#0B1535",
  badge: "#FF4444",
} as const;

export const useTabColors = () => {
  const { colors } = useTheme();

  return {
    active: colors.PRIMARY,
    inactive: colors.SECONDARY,
    background: colors.BACKGROUND,
    badge: colors.COLLECTION_ERROR,
    border: colors.BORDER,
  } as const;
};

export const TAB_SIZES = {
  icon: 26,
  iconActive: 28,
  labelSize: 10,
  paddingVertical: 16,
  badgeSize: 18,
} as const;

// Core tabs configuration
export const TABS_CONFIG: TabItem[] = [
  { key: "home", label: "Home", icon: Book, screen: "HomeScreen" },
  { key: "prayer", label: "Prayer", icon: Clock, screen: "PrayerTimesScreen" },
  { key: "fasting", label: "Fasting", icon: Calendar, screen: "FastingScreen" },
  { key: "bookmark", label: "Bookmark", icon: Bookmark, screen: "BookmarkScreen" },
];

// Optional: Add more tabs if needed
export const EXTENDED_TABS_CONFIG: TabItem[] = [
  ...TABS_CONFIG,
  // { key: "qiblat", label: "Qiblat", icon: Compass, screen: "QiblatScreen" },
  // { key: "tasbih", label: "Tasbih", icon: Circle, screen: "TasbihScreen" },
];

export const getTabByKey = (key: TabKey): TabItem | undefined => {
  return TABS_CONFIG.find(tab => tab.key === key);
};

export const isValidTab = (key: string): key is TabKey => {
  return TABS_CONFIG.some(tab => tab.key === key);
};

// Create a dynamic tab configuration function
export const createTabsConfig = (badges?: Partial<Record<TabKey, number>>): TabItem[] => {
  return TABS_CONFIG.map(tab => ({
    ...tab,
    badge: badges ? badges[tab.key] : 0,
  }));
};
