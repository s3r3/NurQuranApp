import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { HOME_TABS, useHomeColors } from "../../constants/home.constants";
import { HomeTab } from "../../types/quran.types";
import { useTranslation } from "react-i18next";

interface HomeTabBarProps {
  activeTab: HomeTab;
  onTabChange: (tab: HomeTab) => void;
}

export const HomeTabBar: React.FC<HomeTabBarProps> = ({
  activeTab,
  onTabChange,
}) => {
  const { t } = useTranslation();
  const colors = useHomeColors();

  return (
    <View style={styles.container}>
      {HOME_TABS.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          onPress={() => onTabChange(tab.id)}
          style={[
            styles.tab,
            activeTab === tab.id && {
              borderBottomWidth: 3,
              borderBottomColor: colors.ACTIVE_TAB_BORDER,
            },
          ]}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === tab.id ? colors.TEXT_PRIMARY : colors.TEXT_SECONDARY },
            ]}
          >
            {t(tab.label)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  tabText: {
    fontWeight: "600",
    fontSize: 16,
  },
});
