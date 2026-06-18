import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { WEEKDAYS, useCalendarColors } from "../../constants/calendar.constants";

export const CalendarWeekHeader: React.FC = () => {
  const colors = useCalendarColors();

  return (
    <View style={styles.container}>
      {WEEKDAYS.map((day) => (
        <Text key={day} style={[styles.text, { color: colors.TEXT_SECONDARY }]}>
          {day}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginHorizontal: 10,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  text: {
    width: "14.28%",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 0.6,
  },
});
