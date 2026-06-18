import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MONTHS, useCalendarColors } from "../../constants/calendar.constants";
import { useTranslation } from "react-i18next";

interface MonthSelectorProps {
  month: number;
  year: number;
}

export const MonthSelector: React.FC<MonthSelectorProps> = ({
  month,
}) => {
  const { t } = useTranslation();
  const colors = useCalendarColors();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.CARD_BG, borderColor: colors.BORDER },
      ]}
    >
      <View style={styles.titleRow}>
        <Text style={[styles.title, { color: colors.TEXT }]}>{t(MONTHS[month])}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 21,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
});
