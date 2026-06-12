import React, { memo } from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { TabIcon } from "./TabIcon";
import { TabLabel } from "./TabLabel";
import { TabItemProps } from "../../types/tabNavigation.types";
import { useTabColors } from "../../constants/tabNavigation.constants";

const Ripple = ({ color, delay = 0 }: { color: string; delay?: number }) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withRepeat(
            withTiming(3, {
              duration: 800,
            }),
            -1,
            false
          ),
        },
      ],
      opacity: withRepeat(
        withTiming(0, {
          duration: 800,
        }),
        -1,
        false
      ),
    };
  });

  return (
    <Animated.View
      style={[
        styles.ripple,
        {
          backgroundColor: color + "40",
        },
        animatedStyle,
      ]}
    />
  );
};

export const TabItem: React.FC<TabItemProps> = memo(
  ({ tab, isActive, iconSize, showLabel, onPress }) => {
    const colors = useTabColors();
    const handlePress = () => {
      onPress(tab.key);
    };

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={handlePress}
        activeOpacity={1}
      >
        {isActive && (
          <View style={styles.rippleContainer} pointerEvents="none">
            <Ripple color={colors.active} />
            <Ripple color={colors.active} />
            <Ripple color={colors.active} />
          </View>
        )}

        <TabIcon
          Icon={tab.icon}
          isActive={isActive}
          size={iconSize}
          badge={tab.badge}
          badgeColor={tab.badgeColor}
        />

        <TabLabel
          label={tab.label}
          isActive={isActive}
          showLabel={showLabel}
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
    overflow: "hidden",
  },

  rippleContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },

  ripple: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
