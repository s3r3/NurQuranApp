import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MONTHS, useCalendarColors } from "../../constants/calendar.constants";
import { useTranslation } from "react-i18next";

interface MonthSelectorProps {
  month: number;
  year: number;
  onPrevious: () => void;
  onNext: () => void;
}

export const MonthSelector: React.FC<MonthSelectorProps> = ({
  month,
  year,
  onPrevious,
  onNext,
}) => {
  const { t } = useTranslation();
  const colors = useCalendarColors();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPrevious}>
        <Text style={[styles.navButton, { color: colors.PRIMARY }]}>‹</Text>
      </TouchableOpacity>
      <Text style={[styles.title, { color: colors.PRIMARY }]}>
        {t(MONTHS[month])} {year}
      </Text>
      <TouchableOpacity onPress={onNext}>
        <Text style={[styles.navButton, { color: colors.PRIMARY }]}>›</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  navButton: {
    fontSize: 34,
    fontWeight: "bold",
    paddingHorizontal: 10,
  },
});
