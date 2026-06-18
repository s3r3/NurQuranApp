import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { hexToRGBA, isToday } from "../../utils/calendarHelpers";
import { CalendarDay } from "../../types/quran.types";
import { getFastingEvent, getIslamicEvent } from "../../utils/fastingHelpers";
import { useCalendarColors } from "../../constants/calendar.constants";

interface CalendarDayCellProps {
  day: CalendarDay;
  currentMonth: number;
  currentYear: number;
  onPress: (day: CalendarDay) => void;
}

export const CalendarDayCell: React.FC<CalendarDayCellProps> = ({
  day,
  currentMonth,
  currentYear,
  onPress,
}) => {
  const { t } = useTranslation();
  const colors = useCalendarColors();
  const today = new Date();
  const isTodayDate = isToday(day.day, currentMonth, currentYear, today);
  
  const fastingEvent = getFastingEvent(
    day.dayOfWeek,
    day.hijriDay,
    day.hijriMonthNumber
  );
  const islamicEvent = getIslamicEvent(day.hijriDay, day.hijriMonthNumber);
  const hasEvent = !!(fastingEvent || islamicEvent);

  const cellStyle = [
    styles.dayCell,
    { backgroundColor: colors.DAY_CELL_BG },
    fastingEvent && {
      backgroundColor: hexToRGBA(fastingEvent.color, 0.1),
      borderLeftWidth: 2,
      borderLeftColor: fastingEvent.color,
    },
    isTodayDate && {
      borderWidth: 2,
      borderColor: colors.PRIMARY,
    },
  ];

  return (
    <TouchableOpacity
      style={cellStyle}
      activeOpacity={0.8}
      onPress={() => hasEvent && onPress(day)}
      disabled={!hasEvent}
    >
      {islamicEvent && <View style={[styles.dot, { backgroundColor: colors.IMPORTANT_DOT }]} />}
      
      <Text
        style={[
          styles.dayNumber,
          { color: colors.TEXT },
          fastingEvent && { color: fastingEvent.color },
        ]}
      >
        {day.day}
      </Text>
      
      <Text style={[styles.hijriText, { color: colors.PRIMARY }]}>{day.hijriDay}</Text>
      
      {fastingEvent && (
        <Text
          numberOfLines={1}
          style={[styles.eventLabel, { color: fastingEvent.color }]}
        >
          {t(fastingEvent.label)}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
    position: "relative",
    paddingHorizontal: 3,
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: "800",
  },
  hijriText: {
    fontSize: 8,
    marginTop: 1,
    fontWeight: "700",
  },
  eventLabel: {
    fontSize: 6.5,
    fontWeight: "700",
    marginTop: 1,
    textAlign: "center",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 4,
    position: "absolute",
    top: 6,
    right: 6,
  },
});
