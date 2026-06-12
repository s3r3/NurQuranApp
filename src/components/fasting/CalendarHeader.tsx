import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useCalendarColors } from "../../constants/calendar.constants";
import { useTranslation } from "react-i18next";

export const CalendarHeader: React.FC = () => {
  const { t } = useTranslation();
  const colors = useCalendarColors();

  return (
    <View style={styles.header}>
      <Text style={[styles.title, { color: colors.TEXT }]}>{t("Islamic Calendar")}</Text>
      <Text style={[styles.subtitle, { color: colors.TEXT_SECONDARY }]}>
        {t("Fasting Calendar & Islamic Events")}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  subtitle: {
    marginTop: 6,
  },
});
