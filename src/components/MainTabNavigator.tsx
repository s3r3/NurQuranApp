import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  Book,
  Compass,
  Clock,
  Calendar,
  Disc,
  Bookmark,
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

// Constants
const ACTIVE_COLOR = "#A44AFF";
const INACTIVE_COLOR = "#8D92A3";
const BACKGROUND_COLOR = "#0B1535";
const PADDING_VERTICAL = 16;

// Types
type TabKey = "home" | "qiblat" | "prayer" | "fasting" | "tasbih" | "bookmark";
type TabNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface BottomTabBarProps {
  active: TabKey;
}

interface TabItem {
  key: TabKey;
  label: string;
  icon: React.ComponentType<{
    size: number;
    color: string;
    strokeWidth: number;
  }>;
  screen: keyof RootStackParamList;
}

// Tab configuration
const TABS: TabItem[] = [
  { key: "home", label: "Home", icon: Book, screen: "HomeScreen" },
  { key: "prayer", label: "Prayer", icon: Clock, screen: "PrayerTimesScreen" },
  { key: "fasting", label: "Fasting", icon: Calendar, screen: "FastingScreen" },
  { key: "tasbih", label: "Tasbih", icon: Disc, screen: "TasbihScreen" },
  {
    key: "bookmark",
    label: "Bookmark",
    icon: Bookmark,
    screen: "BookmarkScreen",
  },
];

const BottomTabBar = ({ active }: BottomTabBarProps) => {
  const navigation = useNavigation<TabNavigationProp>();

  const handleTabPress = (tabKey: TabKey) => {
    const tab = TABS.find((t) => t.key === tabKey);
    if (tab) {
      navigation.navigate(tab.screen as never);
    }
  };

  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = active === tab.key;
        const Icon = tab.icon;

        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabItem}
            onPress={() => handleTabPress(tab.key)}
          >
            <Icon
              size={26}
              color={isActive ? ACTIVE_COLOR : INACTIVE_COLOR}
              strokeWidth={isActive ? 3 : 2}
            />

            {isActive && <Text style={styles.activeTabText}>{tab.label}</Text>}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: BACKGROUND_COLOR,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: PADDING_VERTICAL,
  },
  tabItem: {
    alignItems: "center",
  },
  activeTabText: {
    fontSize: 10,
    marginTop: 1,
    fontWeight: "bold",
    color: ACTIVE_COLOR,
  },
});

export default BottomTabBar;
