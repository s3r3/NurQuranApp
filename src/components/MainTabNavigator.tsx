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

type TabNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface BottomTabBarProps {
  active: "home" | "qiblat" | "prayer" | "fasting" | "tasbih" | "bookmark";
}

const BottomTabBar = ({ active }: BottomTabBarProps) => {
  const navigation = useNavigation<TabNavigationProp>();

  const handleTabPress = (tabKey: string) => {
    switch (tabKey) {
      case "home":
        navigation.navigate("HomeScreen");
        break;
      case "qiblat":
        navigation.navigate("QiblatScreen");
        break;
      case "prayer":
        navigation.navigate("PrayerTimesScreen");
        break;
      case "fasting":
        navigation.navigate("FastingScreen");
        break;
      case "tasbih":
        navigation.navigate("TasbihScreen");
        break;
      case "bookmark":
        navigation.navigate("BookmarkScreen");
        break;
    }
  };

  const tabs = [
    { key: "home", label: "Home", icon: Book },
    { key: "qiblat", label: "Qiblat", icon: Compass },
    { key: "prayer", label: "Prayer", icon: Clock },
    { key: "fasting", label: "Fasting", icon: Calendar },
    { key: "tasbih", label: "Tasbih", icon: Disc },
    { key: "bookmark", label: "Bookmark", icon: Bookmark },
  ] as const;

  const styles = StyleSheet.create({
    container: {
      position: "absolute",
      bottom: 0,
      width: "100%",
      backgroundColor: "#0B1535",
      flexDirection: "row",
      justifyContent: "space-around",
      paddingVertical: 16,
    },
    tabItem: {
      alignItems: "center",
    },
    activeTabText: {
      fontSize: 10,
      marginTop: 1,
      fontWeight: "bold",
      color: "#A44AFF",
    },
  });

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
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
              color={isActive ? "#A44AFF" : "#8D92A3"}
              strokeWidth={isActive ? 3 : 2}
            />

            {isActive && <Text style={styles.activeTabText}>{tab.label}</Text>}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default BottomTabBar;
