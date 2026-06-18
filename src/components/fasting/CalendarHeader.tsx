import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useCalendarColors } from "../../constants/calendar.constants";
import { useTranslation } from "react-i18next";

export const CalendarHeader: React.FC = () => {
  const { t } = useTranslation();
  const colors = useCalendarColors();

  return (
    <View style={styles.header}>
      <Text style={[styles.kicker, { color: colors.PRIMARY }]}>{t("Calendar")}</Text>
      <Text style={[styles.title, { color: colors.TEXT }]}>{t("Islamic Calendar")}</Text>
      <Text style={[styles.subtitle, { color: colors.TEXT_SECONDARY }]}>
        {t("Fasting Calendar & Islamic Events")}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 18,
  },
  kicker: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
  },
});
