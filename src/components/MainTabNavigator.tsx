import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TabItem } from "./bottom-tab/TabItem";
import {
  TABS_CONFIG,
  TAB_SIZES,
  useTabColors,
} from "../constants/tabNavigation.constants";
import { BottomTabBarProps } from "../types/tabNavigation.types";
import { useTabNavigation } from "../hooks/useTabNavigation";

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  active,
  showLabels = true,
  iconSize = TAB_SIZES.icon,
}) => {
  const insets = useSafeAreaInsets();
  const { navigateToTab } = useTabNavigation();
  const colors = useTabColors();

  const paddingBottom =
    insets.bottom > 0 ? insets.bottom : TAB_SIZES.paddingVertical;

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom,
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
      ]}
    >
      {TABS_CONFIG.map((tab) => (
        <TabItem
          key={tab.key}
          tab={tab}
          isActive={active === tab.key}
          iconSize={iconSize}
          showLabel={showLabels}
          onPress={navigateToTab}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: TAB_SIZES.paddingVertical,
    borderTopWidth: 0.5,
  },
});

export default BottomTabBar;
