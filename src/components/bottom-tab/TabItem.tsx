import React, { memo } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { TabIcon } from "./TabIcon";
import { TabLabel } from "./TabLabel";
import { TabItemProps } from "../../types/tabNavigation.types";
import { useTabColors } from "../../constants/tabNavigation.constants";

export const TabItem: React.FC<TabItemProps> = memo(
  ({ tab, isActive, iconSize, showLabel, onPress }) => {
    const colors = useTabColors();
    const handlePress = () => {
      onPress(tab.key);
    };

    const handleLongPress = () => {
      console.log(`Long pressed on ${tab.label} tab`);
    };

    const iconAnimatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            scale: withSpring(isActive ? 1.1 : 1, {
              damping: 20,
              stiffness: 300,
            }),
          },
        ],
      };
    });

    const indicatorAnimatedStyle = useAnimatedStyle(() => {
      return {
        opacity: withTiming(isActive ? 1 : 0, {
          duration: 200,
        }),
        transform: [
          {
            translateY: withTiming(isActive ? 0 : 10, {
              duration: 200,
            }),
          },
        ],
      };
    });

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={handlePress}
        onLongPress={handleLongPress}
        activeOpacity={0.7}
        delayLongPress={500}
      >
        <Animated.View style={iconAnimatedStyle}>
          <TabIcon
            Icon={tab.icon}
            isActive={isActive}
            size={iconSize}
            badge={tab.badge}
            badgeColor={tab.badgeColor}
          />
        </Animated.View>

        <TabLabel
          label={tab.label}
          isActive={isActive}
          showLabel={showLabel}
        />

        <Animated.View
          pointerEvents="none"
          style={[
            styles.activeIndicator,
            { backgroundColor: colors.active },
            indicatorAnimatedStyle,
          ]}
        />
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingVertical: 8,
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
