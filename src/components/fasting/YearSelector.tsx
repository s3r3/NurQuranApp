import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react-native";
import { useCalendarColors } from "../../constants/calendar.constants";
import { useTranslation } from "react-i18next";

interface YearSelectorProps {
  year: number;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
}

export const YearSelector: React.FC<YearSelectorProps> = ({
  year,
  onPrevious,
  onNext,
  onToday,
}) => {
  const { t } = useTranslation();
  const colors = useCalendarColors();

  return (
    <View style={styles.container}>
      <View style={[styles.yearShell, { backgroundColor: colors.CARD_BG, borderColor: colors.BORDER }]}>
        <TouchableOpacity onPress={onPrevious} style={styles.arrowButton} activeOpacity={0.8}>
          <ChevronLeft size={18} color={colors.PRIMARY} />
        </TouchableOpacity>

        <View style={[styles.yearBadge, { backgroundColor: colors.PRIMARY_SOFT_BG }]}>
          <CalendarDays size={14} color={colors.PRIMARY} />
          <Text style={[styles.title, { color: colors.PRIMARY }]}>{year}</Text>
        </View>

        <TouchableOpacity onPress={onNext} style={styles.arrowButton} activeOpacity={0.8}>
          <ChevronRight size={18} color={colors.PRIMARY} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={onToday}
        style={[styles.todayButton, { borderColor: colors.BORDER, backgroundColor: colors.BACKGROUND }]}
        activeOpacity={0.85}
      >
        <Text style={[styles.todayButtonText, { color: colors.TEXT }]}>
          {t("Today")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 10,
  },
  yearShell: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  arrowButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  yearBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
  },
  todayButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
  },
  todayButtonText: {
    fontSize: 12,
    fontWeight: "800",
  },
});
