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
      <View style={styles.grid}>
        <LegendItem color="#3B82F6" label={t("Monday & Thursday")} textColor={colors.TEXT_MUTED} />
        <LegendItem color="#10B981" label={t("Ayyamul Bidh")} textColor={colors.TEXT_MUTED} />
        <LegendItem color="#EF4444" label={t("Ashura & Arafah")} textColor={colors.TEXT_MUTED} />
        <LegendItem color="#FBBF24" label={t("Ramadan")} textColor={colors.TEXT_MUTED} />
        <View style={styles.legendItem}>
          <View style={[styles.whiteDot, { backgroundColor: colors.IMPORTANT_DOT }]} />
          <Text style={[styles.legendText, { color: colors.TEXT_MUTED }]}>{t("Important Islamic Day")}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    columnGap: 8,
    rowGap: 8,
  },
  legendItem: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.035)",
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 4,
    marginRight: 6,
  },
  whiteDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 10,
    fontWeight: "600",
    flexShrink: 1,
  },
});
