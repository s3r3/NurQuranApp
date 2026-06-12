import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useCalendarColors } from "../../constants/calendar.constants";

interface YearSelectorProps {
  year: number;
  onPrevious: () => void;
  onNext: () => void;
}

export const YearSelector: React.FC<YearSelectorProps> = ({
  year,
  onPrevious,
  onNext,
}) => {
  const colors = useCalendarColors();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPrevious}>
        <Text style={[styles.navButton, { color: colors.PRIMARY }]}>‹</Text>
      </TouchableOpacity>
      <Text style={[styles.title, { color: colors.PRIMARY }]}>{year}</Text>
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
    fontSize: 20,
    fontWeight: "bold",
  },
  navButton: {
    fontSize: 34,
    fontWeight: "bold",
    paddingHorizontal: 10,
  },
});
