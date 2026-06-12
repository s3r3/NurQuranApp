import React from "react";
import { Text, StyleSheet } from "react-native";
import { TAB_SIZES, useTabColors } from "../../constants/tabNavigation.constants";

interface TabLabelProps {
  label: string;
  isActive: boolean;
  showLabel: boolean;
}

export const TabLabel: React.FC<TabLabelProps> = ({ label, isActive, showLabel }) => {
  const colors = useTabColors();

  if (!showLabel && !isActive) return null;
  
  return (
    <Text style={[
      styles.label,
      { color: isActive ? colors.active : colors.inactive },
      isActive && styles.activeLabel,
      !showLabel && styles.hiddenLabel,
    ]}>
      {label}
    </Text>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: TAB_SIZES.labelSize,
    marginTop: 4,
    fontWeight: "500",
  },
  activeLabel: {
    fontWeight: "bold",
  },
  hiddenLabel: {
    display: "none",
  },
});
