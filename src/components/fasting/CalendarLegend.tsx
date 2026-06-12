import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useCalendarColors } from "../../constants/calendar.constants";
import { useTranslation } from "react-i18next";

const LegendItem = ({ color, label, textColor }: { color: string; label: string; textColor: string }) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendColor, { backgroundColor: color }]} />
    <Text style={[styles.legendText, { color: textColor }]}>{label}</Text>
  </View>
);

export const CalendarLegend: React.FC = () => {
  const { t } = useTranslation();
  const colors = useCalendarColors();

  return (
    <View style={styles.container}>
      <LegendItem color="#3B82F6" label={t("Monday & Thursday")} textColor={colors.TEXT_MUTED} />
      <LegendItem color="#10B981" label={t("Ayyamul Bidh")} textColor={colors.TEXT_MUTED} />
      <LegendItem color="#EF4444" label={t("Ashura & Arafah")} textColor={colors.TEXT_MUTED} />
      <LegendItem color="#FBBF24" label={t("Ramadan")} textColor={colors.TEXT_MUTED} />
      <View style={styles.legendItem}>
        <View style={[styles.whiteDot, { backgroundColor: colors.IMPORTANT_DOT }]} />
        <Text style={[styles.legendText, { color: colors.TEXT_MUTED }]}>{t("Important Islamic Day")}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  legendItem: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 4,
    marginRight: 8,
  },
  whiteDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
  },
});
